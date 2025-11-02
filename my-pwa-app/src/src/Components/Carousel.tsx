import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import type { CarouselItemData } from './Interfaces/interfaces';
import { DataPictures } from './Data/DataPictures';

function ControlledCarousel() {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number | null) => {
    if (typeof selectedIndex === 'number') setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={(selectedIndex) => handleSelect(selectedIndex)}>
      {DataPictures.map((item: CarouselItemData) => (
        <Carousel.Item key={item.id}>
          <img className="d-block w-100" src={item.src} alt={item.alt} />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
