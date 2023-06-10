import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import getAllComposers from '../helpers/data/composerData';
import getAllCompositionsByComposer from '../helpers/data/compositionData';
import getExcerptsByCompositionID from '../helpers/data/excerptData';
import GetSequence from '../helpers/data/sequenceData';


const SequenceSelector = ({setSequence}) => {
  const [composerSelectOptions, setComposerSelectOptions] = useState(null);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState(null);
  const [excerptSelectOptions, setExcerptSelectOptions] = useState(null);
  const compositionRef = useRef();
  const excerptRef = useRef();
  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      background: '#aaaaaa'
    }),

    option: (baseStyles, state) => ({
      ...baseStyles,
      "&:hover" : { background: 'purple'},
      background: state.isSelected? 'red': 'blue',
    })
  };
  useEffect(() => {
    const composerOptionsArr = [];
    let mounted = true;
    getAllComposers().then((composerArray) => {
      for (let i = 0; i < composerArray.length; i += 1) {
        const option = {
          value: composerArray[i].id,
          label: `${composerArray[i].last}, ${composerArray[i].first}`,
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

  const handleComposerSelection = (selectedComposer) => {
    // console.warn('handleComposerSelection');
    // console.warn(selectedComposer);
    getAllCompositionsByComposer(selectedComposer.value).then((compositionArray) => {
      const compositionOptionsArr = [];
      for (let i = 0; i < compositionArray.length; i += 1) {
        const option = {
          value: compositionArray[i].id,
          label: `${compositionArray[i].title}`,
          disabled: false
        };
        compositionOptionsArr.push(option);
      }
      compositionRef.current.clearValue();
      setCompositionSelectOptions(compositionOptionsArr);
      // console.warn(compositionRef.current);
    })
      .catch(setCompositionSelectOptions([]));
  };

  const handleCompositionSelection = (selectedComposition) => {
    if(selectedComposition){
    // console.warn('handleCompositionSelection');
    // console.warn(selectedComposition);
    getExcerptsByCompositionID(selectedComposition.value).then((excerptArray) => {
      const excerptOptionsArr = [];
      for (let i = 0; i < excerptArray.length; i += 1) {
        const option = {
          value: excerptArray[i].id,
          label: excerptArray[i].movement 
            ? `${excerptArray[i].movement}: ${excerptArray[i].measures} `
            : `${excerptArray[i].measures}`,
          disabled: false
        };
        excerptOptionsArr.push(option);
      }
      excerptRef.current.clearValue();
      setExcerptSelectOptions(excerptOptionsArr);
    })}
  };

  const handleExcerptSelection = (selectedExcerpt) => {
    if(selectedExcerpt){
      GetSequence(selectedExcerpt.value).then((segmentArray) => {
        const resultArray = [];
        for (let i = 0; i < segmentArray.length; i+= 1){
          let patternStringArray = segmentArray[i].beatPattern.split(',');
          let patternIntArray = [];
          patternStringArray.forEach((numberOfBeats) => {
            patternIntArray.push(parseInt(numberOfBeats));
          });
          const resultObj = {
            pattern: patternIntArray,
            reps: segmentArray[i].repetitions,
            tempo: segmentArray[i].tempo
          }
          resultArray.push(resultObj);
        }
        setSequence(resultArray);
      });
    }
  };

  return (
    <div className='select-sequence'>
      <div className='select-composer'>
        <h3>Select Composer</h3>
        <Select styles={selectStyles} options={composerSelectOptions} 
          onChange={handleComposerSelection}/>
      </div>
      <div className='select-composition'>
        <h3>Select Composition</h3>
        <Select styles={selectStyles} options={compositionSelectOptions}
          ref={compositionRef}
          // use key to force re-render on composer change
          // key={compositionSelectOptions.length ?  composerSelectOptions[0].id : 'select_composition-id'}
          isClearable={true}
          onChange={(selectedComposition) => {
            handleCompositionSelection(selectedComposition);
          }}/>
      </div>
      <div className='select-excerpt'>
        <h3>Select Excerpt</h3>
        <Select styles={selectStyles} options={excerptSelectOptions}
          ref={excerptRef}
          isClearale={true}
          onChange={(e) =>{
            handleExcerptSelection(e);
          }}/>
      </div>
    </div>
  )
}

SequenceSelector.propTypes = {
  setSequence: PropTypes.func
};

export default SequenceSelector;
