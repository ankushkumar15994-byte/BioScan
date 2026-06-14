"""
Bioscan Plant Disease ML Training Pipeline
Requires an RTX GPU (e.g., RTX 4050) and Kaggle API setup.

Setup Instructions:
1. Ensure you have installed CUDA Toolkit and cuDNN compatible with TensorFlow 2.14.
2. Go to Kaggle -> Settings -> Create New API Token. Place `kaggle.json` in `C:\\Users\\<Username>\\.kaggle\\`.
3. Run `pip install -r ../requirements.txt`
4. Run `python train_model.py`
"""

import os
import subprocess
import json
import tensorflow as tf

from tensorflow.keras.applications import MobileNetV2  # type: ignore
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout  # type: ignore
from tensorflow.keras.models import Model  # type: ignore
from tensorflow.keras.optimizers import Adam  # type: ignore
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau  # type: ignore

# --- Configuration ---
DATASET_NAME = "vipoooool/new-plant-diseases-dataset"
ZIP_FILE = "new-plant-diseases-dataset.zip"
EXTRACT_DIR = "dataset"
BATCH_SIZE = 32  # Fits comfortably in RTX 4050 6GB VRAM
IMG_SIZE = (224, 224)
EPOCHS = 20
MODEL_SAVE_PATH = "../api/plant_disease_model.h5"


def download_and_extract_dataset():
    if not os.path.exists(EXTRACT_DIR):
        subprocess.run(["kaggle", "datasets", "download", "-d", DATASET_NAME], check=True)

        print("Extracting dataset...")
        import zipfile
        with zipfile.ZipFile(ZIP_FILE, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)

        os.remove(ZIP_FILE)
        print("Extraction complete.")
    else:
        print("Dataset already exists. Skipping download.")


def build_model(num_classes):
    print("Building MobileNetV2 architecture...")
    
    # 1. Define data augmentation and preprocessing layers
    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.05),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomTranslation(0.2, 0.2),
    ], name="data_augmentation")
    
    # MobileNetV2 expects inputs in [-1, 1], so we rescale by 1./127.5 and offset by -1
    # Alternatively, since the original code used 1./255, we can stick to that to maintain compatibility
    rescale = tf.keras.layers.Rescaling(1./255, name="rescaling")

    # 2. Build the model architecture
    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = data_augmentation(inputs)
    x = rescale(x)
    
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_tensor=x)

    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False

    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer=Adam(learning_rate=0.001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    return model


def main():
    # 1. Prepare Data
    download_and_extract_dataset()

    # The augmented dataset structure:
    # dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/train
    # dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/valid
    base_path = os.path.join(EXTRACT_DIR, "New Plant Diseases Dataset(Augmented)", "New Plant Diseases Dataset(Augmented)")
    train_dir = os.path.join(base_path, "train")
    valid_dir = os.path.join(base_path, "valid")

    print("Setting up datasets...")

    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        shuffle=True,
        seed=42,
    )

    valid_dataset = tf.keras.utils.image_dataset_from_directory(
        valid_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='categorical',
        shuffle=False,
    )

    # Get class names and count
    class_names = train_dataset.class_names
    num_classes = len(class_names)
    print(f"Found {num_classes} classes.")

    # Save class indices for the API to use later (name -> index mapping)
    class_indices = {name: i for i, name in enumerate(class_names)}
    with open('../api/class_indices.json', 'w') as f:
        json.dump(class_indices, f)

    # Prefetch for performance
    train_dataset = train_dataset.prefetch(tf.data.AUTOTUNE)
    valid_dataset = valid_dataset.prefetch(tf.data.AUTOTUNE)

    # 2. Build Model
    model = build_model(num_classes)

    # 3. Callbacks
    # --- FIX 2: Use .keras format instead of deprecated .h5 ---
    checkpoint = ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6)

    # 4. Train Model
    print("Starting training...")
    history = model.fit(
        train_dataset,
        epochs=EPOCHS,
        validation_data=valid_dataset,
        callbacks=[checkpoint, early_stop, reduce_lr]
    )

    print(f"Training complete. Best model saved to {MODEL_SAVE_PATH}")


if __name__ == "__main__":
    main()
