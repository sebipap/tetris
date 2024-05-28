import Tetris from "./Tetris";

// type File = {
//   name: string;
//   icon: string;
// };

// type Directory = {
//   name: string;
//   children: (Directory | File)[];
// };

// const directory = {
//   name: "root",
//   children: [
//     {
//       name: "Downloads",
//       children: [
//         {
//           name: "image.png",
//           icon: "https://upload.wikimedia.org/wikipedia/en/d/d6/Preview_icon.png",
//         },
//         {
//           name: "unzipped",
//           children: [
//             {
//               name: "README.md",
//               icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWFRlSPVuBKvnBN1MQu_uVENvisDdorClhxDsEOEC6qg&s",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Documents",
//       children: [
//         {
//           name: "code",
//           children: [
//             {
//               name: "silver",
//               children: [
//                 {
//                   name: "coding-challenge",
//                   children: [
//                     {
//                       name: "challenge1.ts",
//                       icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcmf8TZwmWDaQmgc7JW_XK_twnKEv95aHPsFmLCW8r9Q&s",
//                     },
//                     {
//                       name: "challenge2.ts",
//                       icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcmf8TZwmWDaQmgc7JW_XK_twnKEv95aHPsFmLCW8r9Q&s",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// } satisfies Directory;

// function isDirectory(x: Directory | File): x is Directory {
//   return Array.isArray((x as Directory).children);
// }

// function FileIcon({ file }: { file: File }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 2,
//       }}
//     >
//       <img src={file.icon} width={20} height={20} />
//       {file.name}
//     </div>
//   );
// }

// function Folder({ item }: { item: Directory | File }) {
//   const [open, setOpen] = useState(false);

//   if (!isDirectory(item)) return <FileIcon file={item} />;

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//         }}
//         onClick={() => setOpen((o) => !o)}
//       >
//         {open ? "⌄" : "›"}
//         <img
//           src="https://cdn.icon-icons.com/icons2/2963/PNG/512/macos_big_sur_folder_icon_186046.png"
//           width={20}
//           height={20}
//         />
//         {item.name}
//       </div>
//       {open && (
//         <div
//           style={{
//             marginLeft: "16px",
//           }}
//         >
//           {item.children.map((child) => (
//             <Folder item={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default function App() {
  return <Tetris />;
}
