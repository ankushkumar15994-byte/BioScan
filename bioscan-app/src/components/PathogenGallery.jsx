import React, { useState, useEffect } from 'react';
import styles from './PathogenGallery.module.css';

const PathogenGallery = () => {
  const [pathogens, setPathogens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data in case API is not running
  const fallbackPathogens = [
    {
      id: 1,
      name: 'Black Spot',
      scientificName: 'Diplocarpon rosae',
      description: 'Circular black spots with fringed edges on yellowing surface, primarily affecting foliage and leading to severe defoliation.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9oSjjXVbkF7LOTd0RpuIi1OunWZnH-s8NPsK5GEHTfRD2oiDW5AW2oLN7_NhcDRlG2DzFAfLss5BBk__6Vilra5fFRxMLOr9HZEDM8bCB5XpyxBpdpYyOY9oaF-m-1s6ox_SCedL6z0Eh8QzGZ1otjfH-OSV-rODbypCCQvTNAAfNDASiR6JO5HxPj8YQt5NpBruASwdJJFVyCBXqAtQFEEzEfYR8PFYFHGC0EnNNlX4sutGVjmlY7ZoLU_LCzNhv7A9jurkIkk',
    },
    {
      id: 2,
      name: 'Powdery Mildew',
      scientificName: 'Erysiphales spp.',
      description: 'White dusty fungal growth appearing on the green plant surface, impeding photosynthesis and stunting overall growth.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQc6Q31ae4fganjThwdXNQNzH3gmR-DtOEWYFtoHcGyVf8Jk0BoQHoj1T9i-JmqVh6m9R1NWHFydXYVq1XG4D0CIiIYFv1JECg4_PWW3NapjSZOq4YnA-cyTwCszYCqBLXmVPkI4ZNyc_7bhTauvec0wE-ATJ-57h9WYXRiic0_MF-anplqeT0Kg7jWY_Aojf_oH_WhJK669s9bdn3MGQsCcuFh7uZfBnFaPnKySOOeLOmPugDko4Af3YI1pgEkcQaYY_3T-7Rg1w',
    },
    {
      id: 3,
      name: 'Leaf Rust',
      scientificName: 'Puccinia triticina',
      description: 'Characterized by small, orange-brown pustules erupting through the leaf epidermis, draining critical plant nutrients.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi6KSU5y2oFGRw4oDa0-cPyo7De_jBG93V5UmslTmUnmJ1TZHtUg1oEFNjNbMEMjs0xt2xfMzEFSKW8uwOFJy270t7oozylAKwpW2mgTInBSQZwHlmdHUzZxILKoo9ZjtP46qbAsFeZ69UlcassBJ0XBuc3kQLH5A_Ts2i3hi3x16UKVWTo9H4KkuC7lhYNvVZ_f7xf5zgkByitoGEOxxwxubJCQJOVNUar0zgr2tC6EoFSYrtJ-tCnoHF0shfYjkDi8F3BtQn4BI',
    },
    {
      id: 4,
      name: 'Late Blight',
      scientificName: 'Phytophthora infestans',
      description: 'Presents as dark, water-soaked spots often accompanied by white mold on edges. Highly aggressive and destructive pathogen.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1o0mVGw6Y3dpWdea4DQx06erM0OpKD36WxJFkUUDXtidzemmupWaeTc7kd5pwyJNp3ZwJwIamT57umExZ3KCKb0ASJyU66aeHpB7sJycUEqTuEtt9vE7ZALzd12G5XEvf5ZE0y-p-V7YE9iqZXXa7fBSphaX7PPvbLP4xmYhYr6_p4CORqx8lnSc22yyo8LseQeTjP-N9nDh1bFjujtPvp6PkiP92NR74F6FyNUuy6w6vvUtFTog0Gj76gP_LQ6KFrwCqJCx0T5E',
    },
    {
      id: 5,
      name: 'Apple Scab',
      scientificName: 'Venturia inaequalis',
      description: 'Olive-green to brown velvety spots that eventually become corky. Common in apple-growing regions.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-98fn3yta9JlnzcxEBnVVPCedu6zmpQfOUUtGl4UBvuyUwMS2dp00crUyKUIJ8Dzv_bWMsEgl2E_dKJMS0mcAjpWTK2BRN0OiRsuIlf5DLT8k2lD6lLrj-3c96IsiAD-Kmezq-zp-cgeZbRqUEP_qMVagipP2LpvrgbOT1a3-Vw2nO3x_7CbmBxeK9CBKeuGl0BpxWN1fX7nHsw6eY5x_9L2dMXWDNX0Tuqq5Gz_uYXARNMow1tOB75nG8wNEla96DajbOXrDiZM',
    },
    {
      id: 6,
      name: 'Citrus Canker',
      scientificName: 'Xanthomonas axonopodis',
      description: 'Raised brown lesions with oily yellow halos, primarily affecting citrus crops.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXaDrEn5VLMVCMB8FsYRWTfWnraql3eNz7m4TO-YE3R_xpC9YF_7UdOPvSwh5x-umIl0KJMN2jv2tP-iXh5JGKc1otcAMkmIsPy2CPgDAgtxJT7uUHR7V4yKuvrD92FlWwJ_Ket-EvZcuGP9g-GmB3uIFBaQJT4YFvnZPqd79VqWk7I5sGlY9TdRfgBKj84cd6xLNk0WuM88xTg_VbT9s__ZTKRBbyzp2hiqHEbiGKpr2134zWBl4wnQypHON5D3ECgSZ12OoYZxs',
    },
    {
      id: 7,
      name: 'Anthracnose',
      scientificName: 'Colletotrichum spp.',
      description: 'Dark sunken lesions with concentric rings, often seen on fruit and foliage.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxOXBKtd65mv8vKYp6Uy226bMbj_90HXrN8M7coORVlqEbjozwV85crvO_3_fZjn4RmfN_Xih5LXIdcXR5HIgeefUz_GATaKgR_Y-jmH3gNz6MihaAWNzIQX3WhkT6e89qT5JWtiadmLmRD3bpP-qK1l-xEPDks5gUsl361dKc8ZLfMLxfWKcEOrHeake7y-Sd9y8cDeHe-sPrwoH2gXWv9kfErc9zVCtfskr_a2hdheYzQaYLJ5gWuIqRR-LaXAvgCkfsd-m14f4',
    },
    {
      id: 8,
      name: 'Bacterial Wilt',
      scientificName: 'Ralstonia solanacearum',
      description: 'Drooping green leaves with water-soaked streaks, leading to rapid collapse.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSq0OcciJTb-knQ7oADhas1e5r0Un6cYhfFw6XnD38ztaECo6o2eHCYN6HHFkbnUVV5_1WnzSd9bOSh3MX0N6ZWiYTf5oA6FqMULjn364Z3ZMO3htTEPwS7Sg4M8Y4htdLUhD7emLU3WKWnOmGI4h8ditnjdsIgrRKYnPMu750pZDtzjkNp3nztvtvSC_Bs6mUjY5J7zGzM9ipQmfX_eylBUciMr8bp-qtJblsGWz6YNBuGdKK-sKBKqvytru1r6SwSxAaGKdYurE',
    },
  ];

  useEffect(() => {
    const fetchPathogens = async () => {
      try {
        const res = await fetch('/api/pathogens');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        setPathogens(data.pathogens);
      } catch {
        // Fallback to local data if API is not running
        setPathogens(fallbackPathogens);
      } finally {
        setLoading(false);
      }
    };
    fetchPathogens();
  }, []);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pathogen Database</h2>
        <p className={styles.description}>
          Real-time catalog of identified plant pathogens. Each specimen is cataloged with molecular markers and treatment vectors from our AI diagnostic engine.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading pathogen database...</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {pathogens.map((pathogen) => (
            <div key={pathogen.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img
                  src={pathogen.image}
                  alt={pathogen.name}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.imageGradient}></div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{pathogen.name}</h3>
                <p className={styles.cardScientific}>{pathogen.scientificName}</p>
                <p className={styles.cardDesc}>{pathogen.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PathogenGallery;