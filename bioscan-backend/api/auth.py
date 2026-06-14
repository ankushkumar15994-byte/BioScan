import jwt
import requests
import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Depends, Request, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
from passlib.context import CryptContext
from .database import users_collection

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Setup
SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    name: str

class GoogleLogin(BaseModel):
    access_token: str

class UserProfileUpdate(BaseModel):
    name: str
    occupation: Optional[str] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    if users_collection is None:
        raise credentials_exception
        
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

async def get_optional_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email and users_collection is not None:
            return users_collection.find_one({"email": email})
    except Exception:
        pass
    return None

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
def register_user(user: UserCreate):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not configured.")
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and save
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    try:
        users_collection.insert_one(user_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {e}")
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "name": user.name}

@router.post("/login", response_model=Token)
def login_user(user: UserLogin):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not configured.")
        
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "name": db_user.get("name", "User")}

@router.post("/google", response_model=Token)
def google_auth(data: GoogleLogin):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not configured.")
        
    response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {data.access_token}"}
    )
    if not response.ok:
        raise HTTPException(status_code=400, detail="Invalid Google token")
        
    user_info = response.json()
    email = user_info.get("email")
    name = user_info.get("name")
    
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")
        
    db_user = users_collection.find_one({"email": email})
    if not db_user:
        user_dict = {
            "name": name,
            "email": email,
            "password": "", # No password for google-auth users
            "created_at": datetime.utcnow()
        }
        users_collection.insert_one(user_dict)
        db_user = user_dict
        
    access_token = create_access_token(data={"sub": email})
    return {"access_token": access_token, "token_type": "bearer", "name": db_user.get("name", "User")}

@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "created_at": current_user.get("created_at"),
        "occupation": current_user.get("occupation"),
        "avatar_url": current_user.get("avatar_url")
    }

@router.put("/profile")
def update_profile(profile_data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    update_fields = {"name": profile_data.name}
    if profile_data.occupation is not None:
        update_fields["occupation"] = profile_data.occupation

    users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": update_fields}
    )
    return {"success": True, "name": profile_data.name, "occupation": profile_data.occupation}

@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    # Ensure avatars dir exists
    os.makedirs("avatars", exist_ok=True)
    
    # Save file securely
    file_ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{current_user['_id']}{file_ext}"
    file_path = os.path.join("avatars", safe_filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    avatar_url = f"http://localhost:8000/avatars/{safe_filename}"
    
    users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"avatar_url": avatar_url}}
    )
    
    return {"success": True, "avatar_url": avatar_url}
