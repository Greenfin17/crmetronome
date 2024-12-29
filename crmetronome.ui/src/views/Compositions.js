// Compositions.js

import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getAllComposers } from '../helpers/data/composerData';
import getAllCompositionsByComposer from '../helpers/data/compositionData';
import getExcerptsByCompositionID from '../helpers/data/excerptData';

const Compositions = () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const [composerSelectOptions, setComposerSelectOptions] = useState([]);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState([]);
  const [compositionProfile, setCompositionProfile] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [compositionHasExcerpt, setCompositionHasExcerpt] = useState(false);

  const composerRef = useRef();
  const compositionRef = useRef();
  const emptyProfile = {
    id: emptyGuid,
    addedBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
    shared: false,
    composer: emptyGuid,
    title: '',
    catalog: '',
  };
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
  }, []);

  const handleChange= (e) => {
    let value;
    if (e.target.name === 'shared'){
       value = e.target.checked;
    } else value = e.target.value ? e.target.value : '';
    
    setCompositionProfile((prevState) => ({
      ...prevState,
      [e.target.name]: value
    }));
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
    })};

  const handleComposerSelection = (composerSelection, {action}) => {
    let compositionOptionsArr = [];
    if (action === "clear") {
      compositionRef.current.clearValue();
      setCompositionProfile(emptyProfile);
      setSubmitDisabled(true);
    }
    else if (composerSelection) {
      getAllCompositionsByComposer(composerSelection.value).then((compositionArr) => {
        for(let i = 0; i < compositionArr.length; i += 1) {
          const option = {
            value: compositionArr[i].id,
            index: i,
            label: compositionArr[i].title,
            shared: compositionArr[i].shared,
            title: compositionArr[i].title,
            catalog: compositionArr[i].catalog,
            composer: compositionArr[i].composer,
            addedBy: compositionArr[i].addedBy
          };
          compositionOptionsArr.push(option);
        }
        compositionRef.current.clearValue();
        setCompositionSelectOptions(compositionOptionsArr);
      });
    }
  };

  const handleCompositionSelection = (compositionSelection, {action}) => {
    if (action === "clear") {
      setCompositionProfile(emptyProfile);
    }
    else if(compositionSelection) {
      setCompositionProfile(() =>({
        id: compositionSelection.value,
        index: compositionSelection.index,
        label: compositionSelection.label,
        shared: compositionSelection.shared,
        title: compositionSelection.title,
        catalog: compositionSelection.catalog,
        composer: compositionSelection.composer,
        addedBy: compositionSelection.addedBy
      }));
      getExcerptsByCompositionID(compositionSelection.value).then( (excerptArr) => {
        if(excerptArr.length){
          setCompositionHasExcerpt(true);
        }
      });
    } //endif
  };
  const handleSubmit = () => {
    console.warn('handleSubmit');
  };

  const handleDelete = () => {
    console.warn('handleDelete');
  };


  return (
    <>
    <div className='content-page'>
      <h2>Compositions Page</h2>
      <h3>Search Existing Composer</h3>
        <Select isClearable={true} styles={selectStyles} options={composerSelectOptions}
          ref={composerRef}
          onChange={handleComposerSelection} />
        <CreatableSelect isClearable={true} styles={selectStyles} options={compositionSelectOptions}
          ref={compositionRef}
          onChange={handleCompositionSelection} />
    </div>
    <div><h4>Add new composition if not found above</h4>  
      <div className='formOuterDiv'>
        <label className='input-label' htmlFor='composition-title'>Title</label>
          <input className='form-input' type='text' name='title' value={compositionProfile.title}
                label='composition-title' id='composition-title' onChange={handleChange} />
        <label className='input-label' htmlFor='composition-catalog'>Catalog Designation</label>
          <input className='form-input' type='text' name='catalog' value={compositionProfile.catalog}
                label='catalog' id='composition-catalog' onChange={handleChange} />
        <label className='input-label' htmlFor='composition-shared-checkbox'>Shared</label>
          <input className='checkbox-input' id='composition-shared-checkbox' type='checkbox' name='shared' value={compositionProfile.shared}
                checked={compositionProfile.shared}
                label='shared' onChange={handleChange} />
        <div className='button-div'>
          <button className='submit-button' onClick={handleSubmit}
            disabled={submitDisabled}>Submit</button>
          <button className='delete-button' onClick={() => handleDelete()}
            disabled={compositionProfile.id === emptyGuid || compositionHasExcerpt}>Delete</button>
      </div>
      </div>
    </div>
    </>
  );
};

export default Compositions;
