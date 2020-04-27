import React, { useState } from "react";
import { Collapse, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faAt,
  faPhoneAlt,
  faMapMarkerAlt,
  faUserFriends,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faClock } from "@fortawesome/free-regular-svg-icons";
import "../trainingList.css";

const ResultCard = ({ item, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const getJobDetail = () => {
    return (
      <Collapse isOpen={isOpen}>
        {item.description ? (
          <>
            <div className="detailTitle">Description</div>
            <div>{item.description}</div>
          </>
        ) : (
          ""
        )}

        {item.jobTitle ? (
          <>
            <div className="detailTitle">{item.jobTitle}</div>

            {item.published ? (
              <div className="item">
                <div className="leftIcon">
                  <FontAwesomeIcon icon={faCalendarDay} />
                </div>
                <div className="rightText">{"Publiée le " + item.published}</div>
              </div>
            ) : (
              ""
            )}
            {item.contractDuration ? (
              <div className="item">
                <div className="leftIcon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="rightText">{"Durée : " + item.contractDuration}</div>
              </div>
            ) : (
              ""
            )}

            {item.trainingRythm ? (
              <div className="item">
                <div className="leftIcon"></div>
                <div className="rightText">{"Rythme : " + item.trainingRythm}</div>
              </div>
            ) : (
              ""
            )}

            <div className="detailTitle">Description de l'offre</div>

            {item.jobDescription ? <div className="item">{item.jobDescription}</div> : ""}
          </>
        ) : (
          ""
        )}

        <div className="detailTitle">Contact</div>
        {item.contact && item.contact.phone ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faPhoneAlt} />
            </div>
            <div className="rightText">{item.contact.phone}</div>
          </div>
        ) : (
          ""
        )}

        {item.contact && item.contact.email ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faAt} />
            </div>
            <div className="rightText">
              <a href={"mailto://" + item.contact.email}>{item.contact.email}</a>
            </div>
          </div>
        ) : (
          ""
        )}

        {item.url ? (
          <div className="item">
            <div className="leftIcon"></div>
            <div className="rightText">
              <a target="_blank" href={item.url} rel="noopener noreferrer">
                {item.url}
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
      </Collapse>
    );
  };

  const getTrainingDetail = () => {
    return (
      <Collapse isOpen={isOpen}>
        {item.duration ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="rightText">Formation sur {item.duration}</div>
          </div>
        ) : (
          ""
        )}

        {item.startTime ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faCalendarDay} />
            </div>
            <div className="rightText">Rentrée en {item.startTime}</div>
          </div>
        ) : (
          ""
        )}

        {item.seats || item.seatPerClass ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faUserFriends} />
            </div>
            <div className="rightText">
              {item.seats ? (
                <>
                  {item.seats + " places"}
                  <br />
                </>
              ) : (
                ""
              )}
              {item.seatPerClass ? item.seatPerClass + " apprentis / classe" : ""}
            </div>
          </div>
        ) : (
          ""
        )}

        {item.description ? (
          <>
            <div className="detailTitle">Description</div>
            <div>{item.description}</div>
          </>
        ) : (
          ""
        )}

        {item.teachings ? (
          <>
            <div className="detailTitle">Enseignements</div>
            <div>{item.teachings}</div>
          </>
        ) : (
          ""
        )}

        <div className="detailTitle">Conditions d'accès</div>

        <div className="adviceCard"></div>

        <div className="detailTitle">Contact</div>
        {item.contact && item.contact.phone ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faPhoneAlt} />
            </div>
            <div className="rightText">{item.contact.phone}</div>
          </div>
        ) : (
          ""
        )}

        {item.contact && item.contact.email ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faAt} />
            </div>
            <div className="rightText">
              <a href={"mailto://" + item.contact.email}>{item.contact.email}</a>
            </div>
          </div>
        ) : (
          ""
        )}

        {item.url ? (
          <div className="item">
            <div className="leftIcon"></div>
            <div className="rightText">
              <a target="_blank" href={item.url} rel="noopener noreferrer">
                {item.url}
              </a>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="detailTitle">Lieu de la formation</div>

        {item.teachingLocation ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className="rightText">{item.teachingLocation}</div>
          </div>
        ) : (
          ""
        )}

        {item.teachingPhone ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faPhoneAlt} />
            </div>
            <div className="rightText">{item.teachingPhone}</div>
          </div>
        ) : (
          ""
        )}

        {item.services ? (
          <div className="item">
            <div className="leftIcon">
              <FontAwesomeIcon icon={faCoffee} />
            </div>
            <div className="rightText">{item.services}</div>
          </div>
        ) : (
          ""
        )}

        {item.teachingUrl ? (
          <div className="item">
            <div className="leftIcon"></div>
            <div className="rightText">
              <a target="_blank" href={item.teachingUrl} rel="noopener noreferrer">
                {item.teachingUrl}
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
      </Collapse>
    );
  };

  return (
    <div className={"resultCard " + type}>
      {type === "training" ? <div className="trainingTitle">{item.title}</div> : ""}
      <div className="company">{type === "training" ? item.school : item.company}</div>
      <div className="address">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        {" " + item.address}
      </div>
      {type === "job" ? (
        <div className="address">
          <FontAwesomeIcon icon={faUserFriends} />
          {" " + item.people}
        </div>
      ) : (
        ""
      )}

      <Button className="expandButton" onClick={toggle}>
        {isOpen ? "Masquer le détail" : "Voir le détail"}
      </Button>

      <div className="favoriteButton">
        <FontAwesomeIcon icon={faHeart} />
      </div>

      <div style={{ clear: "both" }} />

      {type === "training" ? getTrainingDetail() : getJobDetail()}
    </div>
  );
};

export default ResultCard;
