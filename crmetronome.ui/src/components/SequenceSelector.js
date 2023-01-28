import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import getAllComposers from '../helpers/data/composerData';

const SequenceSelector = () => {
  const [composerSelectOptions, setComposerSelectOptions] = useState(null);
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

  const handleComposerSelection = () => {
    console.warn('handleComposerSelection');
  };

  return (
    <div className='select-sequence'>
      <div className='select-composer'>
        <h3>Select Composer</h3>
        <Select styles={selectStyles} options={composerSelectOptions} 
          onChange={handleComposerSelection}/>
      </div>
    </div>
  )
}

SequenceSelector.propTypes = {
  sequence: PropTypes.array
};

export default SequenceSelector;
