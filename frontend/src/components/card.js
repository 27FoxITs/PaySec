import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card__side card__side_front">
          <div className="flex__1">
            <p className="card__side__name-bank">PaySec bank</p>
            <div className="card__side__chip" />
            <p className="card__side__name-person">Joshua Xu</p>
          </div>
        </div>
        <div className="card__side card__side_back">
          <div className="card__side__black" />
          <p className="card__side__number">XXXX XXXX XXXX XXXX</p>
          <div className="flex__2">
            <p className="card__side__other-numbers card__side__other-numbers_1">XX/XX</p>
            <p className="card__side__other-numbers card__side__other-numbers_2">XXX</p>
            <div className="card__side__photo"><p>Josh's picture</p></div>
            <div className="card__side__debit">debit</div>
          </div>
          <p className="card__side__other-info">
            Paysec.UA | 0 800 205 205 | 
            This is my furry identification card |
            By law not allowed 20KM from the nears preschool | 
          </p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .flex__1 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .flex__2 {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
  }

  .card {
    height: 50mm;
    width: 84mm;
    position: relative;
    perspective: 800px;
  }

  .card__side {
    width: 100%;
    height: 100%;
    border-radius: 3.18mm;
    position: absolute;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    transition: transform 0.7s ease-out;
    cursor: pointer;
    padding: 10px;
  }

  

  .card__side__photo {
    width: 1.4cm;
    height: 1.4cm;
    position: absolute;
    left: 12px;
    bottom: 15px;
    background: grey;
    border-radius: 8%;
  }

  .card__side_front {
    background: linear-gradient(90deg, rgb(0, 0, 0) 0%, #242424 100%);
    transform: rotateY(0deg);
  }

  .card__side_back {
    background: linear-gradient(-90deg, rgb(0, 0, 0) 0%, #242424 100%);
    transform: rotateY(-180deg);
    color: #eeeeee;
  }

  .card__side__name-bank {
    font-family: Inter, sans-serif;
    font-weight: 500;
    position: relative;
    font-size: 22px;
    margin-left: 8px;
    color: white;
  }

  .card__side__name-bank::after {
    content: "Universal Bank";
    position: absolute;
    font-size: 6px;
    top: 105%;
    left: 21%;
    color: #635c77;
  }

  .card__side__name-bank::before {
    content: "₴";
    position: absolute;
    top: 0;
    right: 0;
    color: #635c77;
  }

  .card__side__chip {
    width: 1.3cm;
    height: 1cm;
    margin-left: 22px;
    margin-top: -35px;
    background: rgb(226, 175, 35);
    border-radius: 8px;
  }

  .card__side__chip:after {
    content: "";
    display: block;
    position: absolute;
    height: 24px;
    width: 24px;
    top: 80px;
    right: 15px;
    transform: scale(1.3);
  }

  .card__side__name-person {
    text-transform: uppercase;
    font-family: Roboto Mono, sans-serif;
    font-size: 14px;
    margin-bottom: 10px;
    margin-left: 20px;
    position: relative;
    display: block;
    color: white;
  }

  .card__side__name-person::before {
    content: "";
    display: block;
    position: absolute;
    width: 45px;
    aspect-ratio: 1 / 1;
    background: red;
    bottom: -10px;
    right: 0px;
    border-radius: 50%;
  }

  .card__side__name-person::after {
    content: "";
    display: block;
    position: absolute;
    width: 45px;
    aspect-ratio: 1 / 1;
    background: orange;
    bottom: -10px;
    right: 23px;
    border-radius: 50%;
  }

  .card__side__black {
    background: black;
    width: 100%;
    height: 50px;
    border-radius: 3.18mm 3.18mm 0 0;
    position: absolute;
    top: 0;
    right: 0;
  }

  .card__side__number {
    font-size: 18px;
    font-family: Roboto Mono, sans-serif;
    color: #eeeeee;
    margin: 45px 0px 15px 10px;
  }

  .card__side__other-numbers {
    font-family: Roboto Mono, sans-serif;
    color: #eeeeee;
    display: block;
    margin-left: 10px;
    font-size: 12px;
    backface-visibility: hidden;
    position: relative;
  }

  .card__side__other-numbers::after {
    color: #635c77;
    position: absolute;
    font-size: 8px;
    left: 0;
    bottom: 60px;
  }

  .card__side__other-numbers_1::after {
    content: "СТРОК";
  }

  .card__side__other-numbers_2::after {
    content: "КОД";
  }

  .card__side__other-info {
    color: #635c77;
    font-size: 4px;
    text-align: center;
    font-family: Roboto Mono, sans-serif;
    position: absolute;
    bottom: 10px;
    left: 38px;
    backface-visibility: hidden;
  }

  .card__side__debit {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.8cm;
    height: 1cm;
    border-radius: 1cm;
    background: #c0c0c0;
    position: absolute;
    right: 12px;
    bottom: 25px;
    font-family: Inter;
    color: #666666;
  }

  .card__side__debit::after {
    content: "";
    display: block;
    position: absolute;
    background: rgba(166, 163, 163, 0.7);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    right: 0;
  }

  .card:hover .card__side_front {
    transform: rotateY(180deg);
  }
    img
  {
  width: 100%;
  visibility: hidden;

  }

  .card:hover img
  {
    visibility: visible;

  }

  .card:hover .card__side_back  {
    transform: rotateY(0deg);
  }

  .card:hover .card__side_back {
    transform: rotateY(0deg);
  }`;

export default Card;
