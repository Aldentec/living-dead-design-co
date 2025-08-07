import React, { useState, useCallback } from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

const photos = [
  { src: "https://i.etsystatic.com/7882236/r/il/51e7cf/4360916894/il_794xN.4360916894_mtib.jpg", width: 4, height: 3 },
  { src: "https://i.etsystatic.com/7882236/r/il/72f919/4712083770/il_794xN.4712083770_i2oa.jpg", width: 1, height: 1 },
  // more images...
];

export default function CrochetGallery() {
  const [current, setCurrent] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrent(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrent(0);
    setViewerIsOpen(false);
  };

  return (
    <>
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel currentIndex={current} views={photos} />
          </Modal>
        ) : null}
      </ModalGateway>
    </>
  );
}
