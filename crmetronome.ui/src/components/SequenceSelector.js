import React, {useEffect, useState, useRef} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import getAllComposers from '../helpers/data/composerData';
import getAllCompositionsByComposer from '../helpers/data/compositionData';

const SequenceSelector = () => {
  const [composerSelectOptions, setComposerSelectOptions] = useState(null);
  const [compositionSelectOptions, setCompositionSelectOptions] = useState(null);
  const compositionRef = useRef();
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
      console.warn('in useEffect');
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
    console.warn('handleComposerSelection');
    console.warn(selectedComposer);
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
      setCompositionSelectOptions(compositionOptionsArr);
      console.warn(compositionRef.current);
      compositionRef.current.clearValue();
    })
      .catch(setCompositionSelectOptions([]));
  };

  const handleCompositionSelection = (selectedComposition) => {
    console.warn(selectedComposition);
  }

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
          onChange={(e) => {
            handleCompositionSelection(e);
          }}/>
      </div>
    </div>
  )
}

SequenceSelector.propTypes = {
  sequence: PropTypes.array
};

export default SequenceSelector;
