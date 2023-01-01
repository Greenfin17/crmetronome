import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import getAllComposers from '../helpers/data/composerData';

const SequenceSelector = (sequence) => {
  const [composerSelectOptions, setComposerSelectOptions] = useState(null);
  useEffect(() => {
    const composerOptionsArr = [];
    let mounted = true;
    console.warn(sequence);
    getAllComposers().then((composerArray) => {
      console.warn('in useEffect');
      for (let i = 0; i < composerArray.length; i += 1) {
        const option = {
          value: composerArray[i].ID,
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
    <dir className='select-sequence'>
      <h3>SequenceSelector</h3>
      <Select options={composerSelectOptions} 
        onChange={handleComposerSelection}/>
    </dir>
  )
}

SequenceSelector.propTypes = {
  sequence: PropTypes.array
};

export default SequenceSelector;
