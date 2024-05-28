// import { useCallback, useState } from "react";

// export function IncorrectDependencies(records) {
//   const handleClick = useCallback(() => {
//     trackClick(records);
//   }, []);

//   return (
//     <div>
//       {records.map((record) => (
//         <div key={record.id} id={record.id}>
//           {record.name}
//         </div>
//       ))}
//       <button onClick={handleClick}>Click me!</button>
//     </div>
//   );
// }
