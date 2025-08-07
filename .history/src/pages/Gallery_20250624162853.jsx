import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Masonry from 'react-masonry-css';
import 'yet-another-react-lightbox/styles.css';

const photos = [
  {
    src: "https://i.etsystatic.com/7882236/r/il/51e7cf/4360916894/il_794xN.4360916894_mtib.jpg",
    alt: "Custom skull crochet",
  },
  {
    src: "https://i.etsystatic.com/7882236/r/il/72f919/4712083770/il_794xN.4712083770_i2oa.jpg",
    alt: "Spider crochet",
  },
  {
    src: "https://i.etsystatic.com/7882236/r/il/81fc86/6037798963/il_794xN.6037798963_gz7k.jpg",
    alt: "Spider crochet",
  },
  {
    src: "https://i.etsystatic.com/7882236/r/il/2d6274/6230561487/il_794xN.6230561487_m1n6.jpg",
    alt: "Spider crochet",
  },
  {
    src: "https://i.etsystatic.com/7882236/r/il/958853/5442237533/il_794xN.5442237533_gr7e.jpg",
    alt: "Spider crochet",
  },
];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="p-4 text-light">
      <h1 className="mb-4">Crochet Gallery</h1>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {photos.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            onClick={() => setOpenIndex(i)}
            style={{
              width: '100%',
              marginBottom: '10px',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
        ))}
      </Masonry>

      <Lightbox
        open={openIndex >= 0}
        index={openIndex}
        close={() => setOpenIndex(-1)}
        slides={photos}
      />
    </div>
  );
}
