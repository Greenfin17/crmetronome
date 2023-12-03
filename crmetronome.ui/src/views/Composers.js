import React, {useEffect, useState} from 'react';
import CreatableSelect from 'react-select/creatable';
import {getAllComposers, addComposer} from '../helpers/data/composerData';

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

  useEffect(() => {
    const composerOptionsArr = [];
    let mounted = true;
    getAllComposers().then((composerArray) => {
      for (let i = 0; i < composerArray.length; i += 1) {
        const option = {
          value: composerArray[i].id,
          index: i,
          label: `${composerArray[i].last}, ${composerArray[i].first}`,
          shared: composerArray[i].shared,
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
  }, []);

  const handleComposerSelection = (composerSelection) => {
    // console.warn(composerSelection);
    // console.warn(composerSelection.birth.substring(0,10));
    setComposerProfile(() => ({
      id: composerSelection.value,
      index: composerSelection.index,
      addedBy: composerSelection.addedBy ? composerSelection.addedBy: '',
      shared: composerSelection.shared,
      first: composerSelection.first ? composerSelection.first : '',
      middle: composerSelection.middle ? composerSelection.middle : '',
      last: composerSelection.last ? composerSelection.last : '',
      birth: composerSelection.birth ? composerSelection.birth.substring(0,10).split('/').reverse().join('-') : '',
      death: composerSelection.death ? composerSelection.death.substring(0,10).split('/').reverse().join('-') : ''
    }));
  }

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

      }));
      }
    else {
      // Editing existing composer
      console.warn("normal submit");
      let composerObj = {};
        if (composerProfile.shared !== composerSelectOptions[composerProfile.index].shared) {
          composerObj.shared = composerProfile.shared;
        }
        if (composerProfile.first !== composerSelectOptions[composerProfile.index].first) {
          composerObj.first = composerProfile.first;
        }
        if (composerProfile.middle !== composerSelectOptions[composerProfile.index].middle) {
          composerObj.middle = composerProfile.middle;
        }
        if (composerProfile.last !== composerSelectOptions[composerProfile.index].last) {
          composerObj.last = composerProfile.last;
        }
        if (composerProfile.birth !== composerSelectOptions[composerProfile.index].birth
                                      .substring(0,10).split('/').reverse().join('-')) {
          composerObj.birth = composerProfile.birth;
        }
        if (composerProfile.death !== composerSelectOptions[composerProfile.index].death
                                      .substring(0,10).split('/').reverse().join('-')) {
          composerObj.death = composerProfile.death;
        }
        if (Object.keys(composerObj).length) {
          composerObj.id = composerSelectOptions[composerProfile.index].value;
          console.warn(composerObj);
        }
    }

  }

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
        <CreatableSelect IsClearable styles={selectStyles} options={composerSelectOptions}
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
        <input className='form-input' type='date' name='birth' value={composerProfile.birth}
              label='Birth' id='composer-birth' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-death'>Death</label>
        <input className='form-input' type='date' name='death' value={composerProfile.death}
              label='death' id='composer-death' onChange={handleChange} />
      <label className='input-label' htmlFor='composer-shared-checkbox'>Shared</label>
        <input className='checkbox-input' id='composer-shared-checkbox' type='checkbox' name='shared' value={composerProfile.shared}
              checked={composerProfile.shared}
              label='shared' onChange={handleChange} />
      <div className='button-div'>
        <button className='submit-button' onClick={handleSubmit}>Submit</button>
      </div>
    </div>

    </div>
    </>
  );
};

export default Composers;
