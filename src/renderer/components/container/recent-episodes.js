import * as React from "react";
import { useEffect, useState } from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";
import { useStore } from "react-redux";
import _ from "lodash";

export default function RecentEpisodes(props) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [atLeftBound, setAtLeftBound] = useState(true);

  const episodeCards = React.createRef();

  const store = useStore();

  useEffect(() => refreshRecent(), []);

  const refreshRecent = () => {
    let previousRecent = recent;
    let currentRecent = store.getState()["recent-releases"];

    if (!_.isEqual(previousRecent, currentRecent)) {
      const values = Object.values(currentRecent);

      setRecent(values);
      if (values.length > 0) setUpdated(true);
    }
  };

  store.subscribe(refreshRecent);

  const onScroll = (direction, targetElement) => {
    if (direction === "right") {
      props.onPageFlip();
      setAtLeftBound(false);
    } else {
      setAtLeftBound(targetElement.scrollLeft <= targetElement.clientWidth);
    }
  };

  return (
    <div className={"no-selection"}>
      <h1 className={"recent-episodes-title"}>Recent</h1>
      <div className={"episode-releases-container"}>
        <ScrollButton
          targetRef={episodeCards}
          direction={"left"}
          display={!atLeftBound}
          onScroll={onScroll}
        />
        <div className={"episode-releases"} ref={episodeCards}>
          {updated && recent.map(element => {
            let index = recent.indexOf(element);

            element = element[1][0];

            return (
              <EpisodeCard
                key={index}
                anime_name={element.name}
                season={element.season}
                episode_number={element.episode}
                link={element.link}
                history={props.history}
              />);
          })}
        </div>
        <ScrollButton
          targetRef={episodeCards}
          direction={"right"}
          display={true}
          onScroll={onScroll}
        />
      </div>
    </div>
  );
}
