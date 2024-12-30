// Compositions.js

import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
// import CreatableSelect from 'react-select/creatable';
import { getAllComposers } from '../helpers/data/composerData';
import { getAllCompositionsByComposer,
         addComposition,
         deleteComposition,
         updateCompositionWithPatch } from '../helpers/data/compositionData';
import getExcerptsByCompositionID from '../helpers/data/excerptData';

const Compositions = () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const emptyProfile = {
    id: emptyGuid,
    addedBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
    shared: false,
    composer: emptyGuid,
    title: '',
    catalog: ''
  };
  const [composerSelectOptions, setComposerSelectOptions] = useState([]);
  const [currentComposer, setCurrentComposer] = useState(null);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState([]);
  const [compositionProfile, setCompositionProfile] = useState(emptyProfile);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [compositionHasExcerpt, setCompositionHasExcerpt] = useState(false);
  const composerRef = useRef();
  const compositionRef = useRef();
  
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

  const checkChangedForm = () => {
    if (compositionProfile.index != null) {
      if (compositionProfile.title != compositionSelectOptions[compositionProfile.index].title ||
         compositionProfile.catalog != compositionSelectOptions[compositionProfile.index].catalog ||
         compositionProfile.shared != compositionSelectOptions[compositionProfile.index].shared) {
          setSubmitDisabled(false);
      } else setSubmitDisabled(true);
     } else if (compositionProfile.title != emptyProfile.title ||
       compositionProfile.catalog != emptyProfile.catalog ||
       compositionProfile.shared != emptyProfile.shared) {
        setSubmitDisabled(false);
       } else setSubmitDisabled(true);

  };

  const clearCompositionProfileWithComposer = (composerID) => {
    setCompositionProfile({
      ...emptyProfile,
      composer: composerID 
    });
  };

  useEffect(() => {
    if(compositionSelectOptions)
    checkChangedForm();
  }, [compositionProfile]);

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

  const loadCompositions = (composerID) => {
    const compositionOptionsArr = [];
    getAllCompositionsByComposer(composerID).then((compositionArr) => {
      for(let i = 0; i < compositionArr.length; i += 1) {
        const option = {
          value: compositionArr[i].id,
          index: i,
          label: compositionArr[i].title ? compositionArr[i].title : '',
          shared: compositionArr[i].shared,
          title: compositionArr[i].title ? compositionArr[i].title : '',
          catalog: compositionArr[i].catalog ? compositionArr[i].catalog : '',
          composer: compositionArr[i].composer,
          addedBy: compositionArr[i].addedBy
        };
        compositionOptionsArr.push(option);
      }
      compositionRef.current.clearValue();
      setCompositionSelectOptions(compositionOptionsArr);
    });
  };


  const handleComposerSelection = (composerSelection, {action}) => {
    if (action === "clear") {
      compositionRef.current.clearValue();
      clearCompositionProfileWithComposer(currentComposer); // clear form
      setSubmitDisabled(true);  // disable submit button
      setCurrentComposer(null); // no composer selected
      setCompositionSelectOptions([]); // clear composition select array
    }
    else if (composerSelection) {
      setCurrentComposer(composerSelection.value);
      loadCompositions(composerSelection.value);
    }
  };

  const handleCompositionSelection = (compositionSelection, {action}) => {
    if (action === "clear") {
      clearCompositionProfileWithComposer(currentComposer); // clear form
      setSubmitDisabled(true);
    }
    else if(compositionSelection) {
      setCompositionProfile(() =>({
        id: compositionSelection.value,
        index: compositionSelection.index,
        label: compositionSelection.label ? compositionSelection.title : '',
        title: compositionSelection.title ? compositionSelection.title : '',
        catalog: compositionSelection.catalog ? compositionSelection.catalog : '',
        composer: compositionSelection.composer,
        addedBy: compositionSelection.addedBy,
        shared: compositionSelection.shared
      }));
      getExcerptsByCompositionID(compositionSelection.value).then( (excerptArr) => {
        if(excerptArr.length){
          setCompositionHasExcerpt(true);
        }
      });
    } //endif
  };

  const handleChange= (e) => {
    let value;
    if (e.target.name === 'shared'){
       value = e.target.checked;
    } else value = e.target.value ? e.target.value : '';
    
    setCompositionProfile((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  }; 


  const handleSubmit = () => {
    // Adding new composition
    if (compositionProfile.id === emptyGuid && currentComposer !== emptyGuid) {
      addComposition(compositionProfile).then(() => {
        compositionRef.current.clearValue();
        loadCompositions(currentComposer);
        });
    } else {
    // edit existing composition
    let compositionObj = {};
    // update fields that have changed
    if (compositionProfile.shared !== compositionSelectOptions[compositionProfile.index].shared) {
      compositionObj.shared = compositionProfile.shared;
    }
    if (compositionProfile.title !== compositionSelectOptions[compositionProfile.index].title) {
      compositionObj.title = compositionProfile.title;
    }
    if (compositionProfile.catalog !== compositionSelectOptions[compositionProfile.index].catalog) {
      compositionObj.catalog = compositionProfile.catalog;
    }
    // if any fields were updated
    if(Object.keys(compositionObj).length) {
      compositionObj.id = compositionSelectOptions[compositionProfile.index].value;
      updateCompositionWithPatch(compositionObj).then(() => {
        compositionRef.current.clearValue();
        loadCompositions(currentComposer);
        });
      }
    }
  };

  const handleDelete = () => {
    if ( compositionProfile.id != emptyGuid ) {
      deleteComposition(compositionProfile.id).then((response) => {
        if(response.status == 200) {
          loadCompositions(currentComposer);
          clearCompositionProfileWithComposer(currentComposer);
          compositionRef.current.clearValue();
        }
      });
    } else {
      console.warn('Nothing to delete');
    }
  };

  return (
    <>
    <div className='content-page'>
      <h2>Compositions Page</h2>
      <h3>Search Existing Composer</h3>
        <Select isClearable={true} styles={selectStyles} options={composerSelectOptions}
          ref={composerRef}
          onChange={handleComposerSelection} />
        <Select isClearable={true} styles={selectStyles} options={compositionSelectOptions}
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
