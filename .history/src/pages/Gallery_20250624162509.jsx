import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
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
  // more images...
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(-1); // -1 means closed

  return (
    <div className="p-4 text-light">
      <h1 className="mb-4">Crochet Gallery</h1>
      <div className="d-flex flex-wrap justify-content-start">
        {photos.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            onClick={() => setOpenIndex(i)}
            style={{
              width: '500px',
              height: 'auto',
              margin: '10px',
              cursor: 'pointer',
              border: '1px solid #333',
              borderRadius: '4px',
            }}
          />
        ))}
      </div>
      <Lightbox
        open={openIndex >= 0}
        index={openIndex}
        close={() => setOpenIndex(-1)}
        slides={photos}
      />
    </div>
  );
}
