import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
function InputVarList() {
  const { idevalcomp } = useParams();

  const [inputVars, setInputVars] = useState([]);
  // const [refreshData, setRefreshData] = useState(false); // nouvelle variable d'état pour rafraîchir les données

  useEffect(() => {
    const fetchInputVars = async () => {
      try {
        const response = await axios.get(`http://localhost:7072/${idevalcomp}`);
        const inputVars = response.data.map((row) => ({
          varname: row.varname,
          varvalue: "",
          vartype: row.vartype,
          path: row.path,
          error: false,
        }));
        setInputVars(inputVars);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInputVars();
  }, [idevalcomp]); // ajout de refreshData comme dépendance
  // }, [idevalcomp, refreshData]); // ajout de refreshData comme dépendance

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:7072/${idevalcomp}`, inputVars)
      .then((response) => {
        console.log(response.data);
        // setRefreshData(!refreshData); // mise à jour de refreshData pour rafraîchir les données
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
    <Container>
      <Title>Données d'évaluation #{idevalcomp}</Title>
      <Form onSubmit={handleSubmit}>
        {inputVars.map((inputVar, index) => {
          return (
            <InputContainer key={index}>
              <Label>
                {inputVar.varname} ({inputVar.vartype}):
              </Label>
              {inputVar.vartype === "boolean" ? (
                <Select
                  name={inputVar.varname}
                  value={inputVar.varvalue}
                  onChange={(event) => handleInputChange(event, index)}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </Select>
              ) : (
                <Input
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
              )}
              {inputVar.error && (
                <ErrorMessage>Type de données invalide</ErrorMessage>
              )}
            </InputContainer>
          );
        })}
        <Button type="submit">Enregistrer</Button>
      </Form>
    </Container>
  );
}

export default InputVarList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; /* Ajouter la hauteur de la vue */
  justify-content: center; /* Centrer les enfants horizontalement et verticalement */
`;

const Title = styled.h2`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: none;
  background-color: #eee;
  box-shadow: 0 0.4rem #dfd9d9;
  border-radius: 45px;
  padding: 10px;
  margin-left: 10px;
  &:hover {
    background-color: #f4f9fa;
  }
  &:focus {
    outline: none;
    border: 2px solid #f08080;
  }
`;

const Select = styled.select`
  border: none;
  background-color: #eee;
  box-shadow: 0 0.4rem #dfd9d9;
  border-radius: 45px;
  padding: 10px;
  margin-left: 10px;
  &:hover {
    background-color: #f4f9fa;
  }
  &:focus {
    outline: none;
    border: 2px solid #f08080;
  }
`;

const ErrorMessage = styled.p`
  color: #cb4a4a;
  margin-top: 5px;
  margin-left: 15px;
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 45px;
  padding: 10px 20px;
  margin-top: 20px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    background-color: #23c483;
    color: #ffffff;
    transform: translateY(-7px);
  }
`;
