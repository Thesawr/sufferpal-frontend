import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { createGear } from '../../graphql/mutations';

const AddGearForm = (props) => {
  const { toggleAddGearModal } = props;
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const userID = useSelector((state) => state.user.id);

  const handleBrandOnChange = (event) => {
    const { value } = event.target;
    setBrand(value);
  };
  const handleModelOnChange = (event) => {
    const { value } = event.target;
    setModel(value);
  };
  const handlePurchaseDateOnChange = (event) => {
    const { value } = event.target;
    console.log(value);
    setPurchaseDate(value);
  };
  const addGear = async (gear) => {
    await API.graphql(graphqlOperation(createGear, { input: gear }));
  };
  const handleAddGearSubmit = (event) => {
    event.preventDefault();
    const gearData = {
      brand,
      model,
      datePurchased: purchaseDate,
      isEquipped: false,
      userID: userID,
      distance: 0,
    };
    addGear(gearData).then(() => {
      toggleAddGearModal();
    });
  };

  return (
    <Form onSubmit={handleAddGearSubmit}>
      <FormGroup>
        <Label for="brand">Brand</Label>
        <Input type="text" name="Brand" id="brand" onChange={handleBrandOnChange} />
      </FormGroup>
      <FormGroup>
        <Label for="model">Model</Label>
        <Input type="text" name="Model" id="model" onChange={handleModelOnChange} />
      </FormGroup>
      <FormGroup>
        <Label for="purchaseDate">Date</Label>
        <Input
          type="date"
          name="Purchase Date"
          id="purchaseDate"
          placeholder="date placeholder"
          onChange={handlePurchaseDateOnChange}
        />
      </FormGroup>
      <Button color="primary">Submit</Button>
      <Button color="secondary" onClick={toggleAddGearModal}>
        Cancel
      </Button>
    </Form>
  );
};

export default AddGearForm;
