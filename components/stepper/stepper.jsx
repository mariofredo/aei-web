export default function Stepper({list = []}) {
  return (
    <div className='stepper_ctr'>
      {list.map((item, index) => (
        <div className='stepper_item'>{index}</div>
      ))}
    </div>
  );
}
