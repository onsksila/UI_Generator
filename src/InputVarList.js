import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function InputVarList() {
  const { idtestevalcomp } = useParams(); // récupère l'id d'evaluation de comparaison depuis l'URL

  const [inputVars, setInputVars] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:7072/${idtestevalcomp}`)
      .then((response) => {
        const inputVars = response.data.map((row) => ({
          varname: row.varname,
          varvalue: "",
          vartype: row.vartype, // initialise la valeur de la variable à une chaîne vide
          error: false, // initialise la propriété d'erreur à false
        }));
        setInputVars(inputVars);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [idtestevalcomp]);

  // fonction pour gérer la soumission des données
  const handleSubmit = (event) => {
    event.preventDefault(); // empêche le formulaire de se soumettre normalement

    // envoie une requête POST à l'API pour enregistrer les données
    axios
      .post(`http://localhost:7072/${idtestevalcomp}`, inputVars)
      .then((response) => {
        console.log(response.data); // affiche les données enregistrées dans la console
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // fonction pour mettre à jour la valeur de la variable lorsqu'elle est modifiée
  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setInputVars((prevInputVars) =>
      prevInputVars.map((inputVar, i) => {
        if (i === index) {
          const vartypeArr = inputVar.vartype
            ? inputVar.vartype.split("|")
            : null;
          let validType = false;
          if (vartypeArr) {
            for (let i = 0; i < vartypeArr.length; i++) {
              if (
                (vartypeArr[i] === "integer" && !isNaN(parseInt(value))) ||
                (vartypeArr[i] === "double" && !isNaN(parseFloat(value))) ||
                (vartypeArr[i] === "string" && typeof value === "string") ||
                (vartypeArr[i] === "boolean" &&
                  (value === "true" || value === "false"))
              ) {
                validType = true;
                break;
              } else if (
                vartypeArr[i] === null ||
                vartypeArr[i] === undefined
              ) {
                validType = true;
                break;
              }
            }
          } else {
            validType = true;
          }
          return {
            ...inputVar,
            varvalue: value,
            error: !validType,
          };
        } else {
          return inputVar;
        }
      })
    );
  };

  return (
    <div>
      <h2>
        Liste des variables d'entrée pour l'évaluation de comparaison #
        {idtestevalcomp}
      </h2>
      <form onSubmit={handleSubmit}>
        {inputVars.map((inputVar, index) => {
          if (inputVar.vartype === "boolean") {
            return (
              <div key={index}>
                <label>{inputVar.varname}</label>
                <span>({inputVar.vartype})</span>
                <select
                  name={inputVar.varname}
                  value={inputVar.varvalue}
                  onChange={(event) => handleInputChange(event, index)}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
                {inputVar.error && (
                  <p style={{ color: "red" }}>Type de données invalide</p>
                )}
              </div>
            );
          } else {
            return (
              <div key={index}>
                <label>{inputVar.varname}</label>
                <span>({inputVar.vartype})</span>
                <input
                  type={
                    inputVar.vartype === "integer" ||
                    inputVar.vartype === "double"
                      ? "number"
                      : "text"
                  }
                  name={inputVar.varname}
                  value={inputVar.varvalue}
                  onChange={(event) => handleInputChange(event, index)}
                />
                {inputVar.error && (
                  <p style={{ color: "red" }}>Type de données invalide</p>
                )}
              </div>
            );
          }
        })}

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default InputVarList;
