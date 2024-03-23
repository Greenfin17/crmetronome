import React, {useEffect, useState} from 'react';
import CreatableSelect from 'react-select/creatable';
import {getAllComposers, addComposer, updateComposerWithPatch, deleteComposer} from '../helpers/data/composerData';
import getAllCompositionsByComposer from '../helpers/data/compositionData';


const Composers = () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const [composerSelectOptions, setComposerSelectOptions] = useState();
  const emptyProfile = {
    id: emptyGuid,
    addedBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
    shared: false,
    first: '',
    middle: '',
    last: '',
    birth: '',
    death: ''
  };
  const [composerProfile, setComposerProfile] = useState(emptyProfile);
  const [composerHasComposition, setComposerHasComposition] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const composerOptionsArr = [];
    let mounted = true;
    getAllComposers().then((composerArray) => {
      console.warn("reloading");
      for (let i = 0; i < composerArray.length; i += 1) {
        const option = {
          value: composerArray[i].id,
          index: i,
          label: `${composerArray[i].last}, ${composerArray[i].first}`,
          shared: composerArray[i].shared,
          addedBy: composerArray[i].addedBy,
          first: composerArray[i].first ? composerArray[i].first: '',
          last: composerArray[i].last ? composerArray[i].last: '',
          middle: composerArray[i].middle ? composerArray[i].middle: '',
          birth: composerArray[i].birth ? composerArray[i].birth: '',
          death: composerArray[i].death ? composerArray[i].death: '',
          disabled: false
        };
        composerOptionsArr.push(option);
      }
        if (mounted){
          setComposerSelectOptions(composerOptionsArr);
        }
    })
      .catch(setComposerSelectOptions([]));
    
      return function cleanup() {
      mounted = false;
    };
  }, [reload]);

  const handleComposerSelection = (composerSelection) => {
    if (composerSelection) {
      let jsBirthDate = "0000-00-00";
      let jsDeathDate = "0000-00-00";
      if(composerSelection.birth !== null) {
        let birthDateParts = composerSelection.birth.split('/');
        jsBirthDate = (birthDateParts[2].substr(0,4) + '-' + birthDateParts[0] + '-' +  birthDateParts[1] );
        console.warn(jsBirthDate);
      }
      if(composerSelection.death) {
        let deathDateParts = composerSelection.death.split('/');
        jsDeathDate = (deathDateParts[2].substr(0,4) + '-' + deathDateParts[0] + '-' +  deathDateParts[1] );
        console.warn(jsDeathDate);
      }

      setComposerProfile(() => ({
        id: composerSelection.value,
        index: composerSelection.index,
        addedBy: composerSelection.addedBy ? composerSelection.addedBy: '',
        shared: composerSelection.shared,
        first: composerSelection.first ? composerSelection.first : '',
        middle: composerSelection.middle ? composerSelection.middle : '',
        last: composerSelection.last ? composerSelection.last : '',
        birth: composerSelection.birth ? jsBirthDate : '',
        death: composerSelection.death ? jsDeathDate : ''
      }));
      getAllCompositionsByComposer(composerSelection.value).then((resultArr) => {
        if(resultArr.length) {
          setComposerHasComposition(true);
        } else {
          setComposerHasComposition(false);
        }  
      });
    }
    else setComposerProfile(emptyProfile);
  };

  const handleNewComposer = (inputValue) => {
    console.warn(inputValue);
    setComposerProfile({
      id: emptyGuid,
      index: '',
      addedBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
      shared: true,
      first: '',
      middle: '',
      last: inputValue,
      birth: '',
      death:'' 
    });

    setComposerHasComposition(false);
  };

  const handleChange = (e) => {
    let value;
    if (e.target.name === 'shared'){
       value = e.target.checked;
    } else value = e.target.value ? e.target.value : '';
    
    setComposerProfile((prevState) => ({
      ...prevState,
      [e.target.name]: value
    }));
  };

  const handleSubmit = () => {
    // Adding new composer
    if (composerProfile.id === emptyGuid) {
      const composerOptionsArr = [];
      addComposer(composerProfile).then(() => getAllComposers().then((composerArray) => {
      for (let i = 0; i < composerArray.length; i += 1) {
        const option = {
          value: composerArray[i].id,
          index: i,
          addedBy: composerArray[i].addedBy,
          label: `${composerArray[i].last}, ${composerArray[i].first}`,
          shared: composerArray[i].shared,
          first: composerArray[i].first,
          last: composerArray[i].last,
          middle: composerArray[i].middle,
          birth: composerArray[i].birth,
          death: composerArray[i].death,
          disabled: false
        };
        composerOptionsArr.push(option);
      }
        setComposerSelectOptions(composerOptionsArr);
        setReload(!reload); //Trigger composer array reload

      }));
      }
    else {
      // Editing existing composer
      console.warn("normal submit");
      let composerObj = {}; 
      // Update fields that have changed.
      // Have to copy shared value as it is a boolean
      composerObj.shared = composerProfile.shared;
      if (composerProfile.first !== composerSelectOptions[composerProfile.index].first) {
        composerObj.first = composerProfile.first;
      }
      if (composerProfile.middle !== composerSelectOptions[composerProfile.index].middle) {
        composerObj.middle = composerProfile.middle;
      }
      if (composerProfile.last !== composerSelectOptions[composerProfile.index].last) {
        composerObj.last = composerProfile.last;
      }
      // check if birth date has changed
      let birthDateParts = composerSelectOptions[composerProfile.index].birth
                                    .substring(0,10).split('/');
      let dbEngineBirthDate = birthDateParts[2] + '-' + birthDateParts[0] + '-' + birthDateParts[1];

      if (composerProfile.birth !== dbEngineBirthDate) {
        composerObj.birth = composerProfile.birth;
      }
      let deathDateParts = composerSelectOptions[composerProfile.index].death
                                    .substring(0,10).split('/');
      let dbEngineDeathDate = deathDateParts[2] + '-' + deathDateParts[0] + '-' + deathDateParts[1];
      if (composerProfile.death !== dbEngineDeathDate) {
        composerObj.death = composerProfile.death;
      }
      if (Object.keys(composerObj).length) {
        composerObj.id = composerSelectOptions[composerProfile.index].value;
        composerObj.addedBy = composerSelectOptions[composerProfile.index].addedBy;
        console.warn(composerObj);
        const composerOptionsArr = [];
        updateComposerWithPatch(composerObj).then(() => getAllComposers().then((composerArray) => {
          for (let i = 0; i < composerArray.length; i += 1) {
            const option = {
              value: composerArray[i].id,
              index: i,
              addedBy: composerArray[i].addedBy,
              label: `${composerArray[i].last}, ${composerArray[i].first}`,
              shared: composerArray[i].shared,
              first: composerArray[i].first,
              last: composerArray[i].last,
              middle: composerArray[i].middle,
              birth: composerArray[i].birth,
              death: composerArray[i].death,
              disabled: false
            };
            composerOptionsArr.push(option);
          }
        setComposerSelectOptions(composerOptionsArr);
        setReload(!reload); //Trigger composer array reload
      }))}
    }
  }

  const handleDelete = () => {
    if ( composerProfile.id != emptyGuid ) {
      console.warn('Deleting composer with id ' + composerProfile.id);
      deleteComposer(composerProfile.id).then((response) => {
        console.warn(response);
        if(response.status == 200)
          console.warn("Composer deleted");
          setReload(!reload); //Trigger composer array reload
          setComposerProfile(emptyProfile);
      });
    } else {
      console.warn('Nothing to delete');
    }
  };

  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      background: '#aaaaaa'
    }),
    option: (baseStyles) =>({
      ...baseStyles,
      "&:hover" : { backgroundColor: 'purple'},
      backgroundColor: '#55aaaa'
    })
  };
  return (
    <>
    <div className='content-page'>
      <h2>Composers Page</h2>
      <h3>Search Existing Composer</h3>
        <CreatableSelect isClearable={true} styles={selectStyles} options={composerSelectOptions}
          onChange={handleComposerSelection}
          onCreateOption={handleNewComposer}/>
    </div>
    <div>
      <h4>Add new composer if not found above</h4>

    <div className='form-outer-div'>
      <label className='input-label' htmlFor='composer-first-name'>First Name</label>
        <input className='form-input' type='text' name='first' value={composerProfile.first}
              label='first' id='composer-first-name' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-middle-name'>Middle Name</label>
        <input className='form-input' type='text' name='middle' value={composerProfile.middle}
              label='middle' id='composer-middle-name' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-last-name'>Last Name</label>
        <input className='form-input' type='text' name='last' value={composerProfile.last}
              label='last' id='composer-last-name' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-birth'>Birth</label>
        <input className='form-input' type='date' name='birth' min = '1000-01-01'
              value={composerProfile.birth} label='Birth' id='composer-birth' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-death'>Death</label>
        <input className='form-input' type='date' name='death' min='1000-01-01'
              value={composerProfile.death} label='death' id='composer-death' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-shared-checkbox'>Shared</label>
        <input className='checkbox-input' id='composer-shared-checkbox' type='checkbox' name='shared' value={composerProfile.shared}
              checked={composerProfile.shared}
              label='shared' onChange={handleChange} />
      <div className='button-div'>
        <button className='submit-button' onClick={handleSubmit}>Submit</button>
        <button className='delete-button' onClick={() => handleDelete()}
          disabled={composerProfile.id === emptyGuid || composerHasComposition}>Delete</button>
      </div>
    </div>

    </div>
    </>
  );
};

export default Composers;
