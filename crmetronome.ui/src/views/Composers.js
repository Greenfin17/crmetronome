import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import getAllComposers from '../helpers/data/composerData';

const Composers = () => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const [composerSelectOptions, setComposerSelectOptions] = useState();
  const [composerProfile, setComposerProfile] = useState({
    id: emptyGuid,
    addedBy: '794B2C17-7A03-41E5-A954-21EAC1F31CF9',
    shared: 0,
    first: '',
    middle: '',
    last: '',
    birth: '',
    death: ''
  });

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

  const handleComposerSelection = () => {

  }
  
  const handleChange = (e) => {
    setComposerProfile((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value ? e.target.value : ''
    }));
  };

  const handleSubmit = () => {
    console.warn('handleSubmit');
  }

  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      background: '#aaaaaa'
    })
  }
  return (
    <>
    <div className='content-page'>
      <h2>Composers Page</h2>
      <h3>Search Existing Composer</h3>
        <Select styles={selectStyles} options={composerSelectOptions}
          onChange={handleComposerSelection}/>
    </div>
    <div>
      <h4>Add new composer if not found above</h4>

    <div className='form-outer-div'>
      <label className='input-label' htmlFor='firstName'>First Name</label>
        <input className='form-input' type='text' name='first' value={composerProfile.first}
              label='firstName' onChange={handleChange} />
      <label className='input-label' htmlFor='middleName'>Middle Name</label>
        <input className='form-input' type='text' name='middle' value={composerProfile.middle}
              label='emailAddress' onChange={handleChange} />
      <label className='input-label' htmlFor='lastName'>Last Name</label>
        <input className='form-input' type='text' name='last' value={composerProfile.last}
              label='lastName' onChange={handleChange} />
      <label className='input-label' htmlFor='profilePicUrl'>Birth</label>
        <input className='form-input' type='text' name='birth' value={composerProfile.birth}
              label='profilePicUrl' onChange={handleChange} />
      <label className='input-label' htmlFor='profilePicUrl'>Death</label>
        <input className='form-input' type='text' name='death' value={composerProfile.death}
              label='profilePicUrl' onChange={handleChange} />
      <div className='button-div'>
        <button className='submit-button' onClick={handleSubmit}>Submit</button>
      </div>
    </div>

    </div>
    </>
  );
};

export default Composers;
