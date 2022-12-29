import React, {useEffect} from 'react';
import Select from 'react-select';
import { propTypes } from 'prop-types';

const SequenceSelector = (sequence) => {
  const [composerSelectOptions, setComposerSelectOptions] = useState(null);
  useEffect = () => {
    let mounted = true;
    if (mounted) {
      
    }


  }

  return (
    <dir className='select-sequence'>
      <Select 
    </dir>
  )
}

SequenceSelector.propTypes = {
  sequence: propTypes.object
};

export default SequenceSelector;
