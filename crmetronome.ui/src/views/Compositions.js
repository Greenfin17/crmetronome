// Compositions.js

import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getAllComposers } from '../helpers/data/composerData';
import getAllCompositionsByComposer from '../helpers/data/compositionData';

const Compositions = () => {
//  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const [composerSelectOptions, setComposerSelectOptions] = useState([]);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState([]);
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
    }
    if (composerSelection) {
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
   
  return (
    <div className='content-page'>
      <h2>Compositions Page</h2>
      <h3>Search Existing Composer</h3>
        <Select isClearable={true} styles={selectStyles} options={composerSelectOptions}
          ref={composerRef}
          onChange={handleComposerSelection} />
        <CreatableSelect isClearable={true} styles={selectStyles} options={compositionSelectOptions}
          ref={compositionRef}
          />
    </div>
  );
};

export default Compositions;
