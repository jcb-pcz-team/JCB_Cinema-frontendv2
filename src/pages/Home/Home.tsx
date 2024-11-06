import './Home.scss';
import React from "react";
import {Input} from "../../components/Input/Input.tsx";
import {Button} from "../../components/Button/Button.tsx";

export const Home : React.FC = () => {
    return(
      <section className="home overlay">
        <h1 className="home__header header--primary">
            Your cinematic world at your fingertips
        </h1>
          <p className="home__paragraph">
              Ready to dive into a movie? Browse and find your perfect film.
          </p>
          <form action="" className="home__form">
              <Input
              type="email"
              placeholder="Search here ..."
              className="home__input-search"
              />
              <Button type="submit" className="button-search">
                  <img src="src/assets/images/search-alt-1-svgrepo-com.svg" alt="search" className="button-search__icon"/>
              </Button>
          </form>
      </section>
    );
};