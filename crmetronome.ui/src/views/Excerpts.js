// Excerpts.js

import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
// import CreatableSelect from 'react-select/creatable';
import { getAllComposers } from '../helpers/data/composerData';
import { getAllCompositionsByComposer } from '../helpers/data/compositionData';
import { getExcerptsByCompositionID,
         addExcerpt,
         updateExcerptWithPatch,
         deleteExcerpt } from '../helpers/data/excerptData';

const Excerpts = () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const emptyProfile = {
    id: emptyGuid,
    createdBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
    shared: false,
    composition: emptyGuid,
    movement: '',
    measures: ''
  };
  const [composerSelectOptions, setComposerSelectOptions] = useState([]);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState([]);
  const [currentComposition, setCurrentComposition] = useState(null);
  const [excerptProfile, setExcerptProfile] = useState(emptyProfile);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [excerptSelectOptions, setExcerptSelectOptions] = useState([]);
  const composerRef = useRef();
  const compositionRef = useRef();
  const excerptRef = useRef();
  
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
    if (excerptProfile.index != null) {
      if (excerptProfile.movement != excerptSelectOptions[excerptProfile.index].movement ||
         excerptProfile.measures != excerptSelectOptions[excerptProfile.index].measures ||
         excerptProfile.shared != excerptSelectOptions[excerptProfile.index].shared) {
          setSubmitDisabled(false);
      } else setSubmitDisabled(true);
     } else if (excerptProfile.movement != emptyProfile.movement ||
       excerptProfile.measures != emptyProfile.measures ||
       excerptProfile.shared != emptyProfile.shared) {
        setSubmitDisabled(false);
       } else setSubmitDisabled(true);
  };

  const clearExcerptProfileWithComposition = (compositionID) => {
    setExcerptProfile({
      ...emptyProfile,
      composition: compositionID 
    });
  };

  useEffect(() => {
    if(excerptSelectOptions)
    checkChangedForm();
  }, [excerptProfile]);

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

  const loadExcerpts = (compositionID) => {
    const excerptOptionsArr = [];
    getExcerptsByCompositionID(compositionID).then((excerptArr) => {
      for(let i = 0; i < excerptArr.length; i += 1) {
        const option = {
          value: excerptArr[i].id,
          index: i,
          composition: excerptArr[i].composition,
          label: excerptArr[i].movement ? excerptArr[i].movement : '' +
            excerptArr[i].measures ? `: Measures ${excerptArr[i].measures}` : '',
          movement: excerptArr[i].movement ? excerptArr[i].movement : '',
          measures: excerptArr[i].measures? excerptArr[i].measures : '',
          catalog: excerptArr[i].catalog ? excerptArr[i].catalog : '',
          createdBy: excerptArr[i].createdBy,
          shared: excerptArr[i].shared
        };
      excerptOptionsArr.push(option);
      excerptRef.current.clearValue();
      setExcerptSelectOptions(excerptOptionsArr);
    }});
  };

  const handleComposerSelection = (composerSelection, {action}) => {
    if (action === "clear") {
      compositionRef.current.clearValue();
      setSubmitDisabled(true);  // disable submit button
      setCompositionSelectOptions([]); // clear composition select array
    }
    else if (composerSelection) {
      loadCompositions(composerSelection.value);
    }
  };

  const handleCompositionSelection = (compositionSelection, {action}) => {
    if (action === "clear") {
      setSubmitDisabled(true);
    } else if(compositionSelection) {
      loadExcerpts(compositionSelection.value);
      setCurrentComposition(compositionSelection.value);
    } //endif
  };

  const handleExcerptSelection = (excerptSelection, {action}) => {
    if (action === "clear") {
      setSubmitDisabled(true);
      clearExcerptProfileWithComposition(currentComposition)
    } else if (excerptSelection) {
      setExcerptProfile(() => ({
        id: excerptSelection.value,
        index: excerptSelection.index,
        createdBy: excerptSelection.createdBy,
        shared: excerptSelection.shared,
        composition: excerptSelection.composition,
        movement: excerptSelection.movement ? excerptSelection.movement : '',
        measures: excerptSelection.measures ? excerptSelection.measures : ''
      }));
    }
  };

  const handleChange= (e) => {
    let value;
    if (e.target.name === 'shared'){
       value = e.target.checked;
    } else value = e.target.value ? e.target.value : '';
    
    setExcerptProfile((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  }; 


  const handleSubmit = () => {
    // Adding new excerpt 
    if (excerptProfile.id === emptyGuid && currentComposition !== emptyGuid) {
      addExcerpt(excerptProfile).then(() => {
        excerptRef.current.clearValue();
        loadExcerpts(currentComposition);
        });
    } else {
    // edit existing composition
    let excerptObj = {};
    // update fields that have changed
    if (excerptProfile.shared !== excerptSelectOptions[excerptProfile.index].shared) {
      excerptObj.shared = excerptProfile.shared;
    }
    if (excerptProfile.movement !== excerptSelectOptions[excerptProfile.index].movement) {
      excerptObj.movement = excerptProfile.movement;
    }
    if (excerptProfile.measures !== excerptSelectOptions[excerptProfile.index].measures) {
      excerptObj.measures = excerptProfile.measures;
    }
    // if any fields were updated
    if(Object.keys(excerptObj).length) {
      excerptObj.id = excerptSelectOptions[excerptProfile.index].value;
      updateExcerptWithPatch(excerptObj).then(() => {
        excerptRef.current.clearValue();
        loadExcerpts(currentComposition);
        });
      }
    }
  };

  const handleDelete = () => {
    if ( excerptProfile.id != emptyGuid ) {
      deleteExcerpt(excerptProfile.id).then((response) => {
        if(response.status == 200) {
          loadExcerpts(currentComposition);
          clearExcerptProfileWithComposition(currentComposition);
          excerptRef.current.clearValue();
        }
      });
    } else {
      console.warn('Nothing to delete');
    }
  };

  return (
    <>
    <div className='content-page'>
      <h2>Excerpts Page</h2>
      <h4>Search Composer</h4>
      <Select isClearable={true} styles={selectStyles} options={composerSelectOptions}
        ref={composerRef}
        onChange={handleComposerSelection} />
      <h4>Search Composition</h4>
      <Select isClearable={true} styles={selectStyles} options={compositionSelectOptions}
        ref={compositionRef}
        onChange={handleCompositionSelection} />
      <h4>Search Excerpt</h4>
      <Select isClearable={true} styles={selectStyles} options={excerptSelectOptions}
        ref={excerptRef}
        onChange={handleExcerptSelection} />

    </div>
    <div><h4>Add new excerpt if not found above</h4>  
      <div className='formOuterDiv'>
        <label className='input-label' htmlFor='excerpt-movement'>Movement</label>
          <input className='form-input' type='text' name='movement' value={excerptProfile.movement}
                label='excerpt-movement' id='excerpt-movement' onChange={handleChange} />
        <label className='input-label' htmlFor='excerpt-measures'>Measures</label>
          <input className='form-input' type='text' name='measures' value={excerptProfile.measures}
                label='excerpt-measures' id='excerpt-measures' onChange={handleChange} />
        <label className='input-label' htmlFor='excerpt-shared-checkbox'>Shared</label>
          <input className='checkbox-input' id='excerpt-shared-checkbox' type='checkbox' name='shared' value={excerptProfile.shared}
                checked={excerptProfile.shared}
                label='shared343' onChange={handleChange} />
        <div className='button-div'>
          <button className='submit-button' onClick={handleSubmit}
            disabled={submitDisabled}>Submit</button>
          <button className='delete-button' onClick={() => handleDelete()}
            disabled={excerptProfile.id === emptyGuid}>Delete</button>
      </div>
      </div>
    </div>
    </>
  );
};

export default Excerpts;
