// import React from 'react';
// import { useRecoilValue } from 'recoil';
// import { snippetState } from '../state/atoms';
// import TextEditor from './TextEditor';
// import { Snippet } from 'shared/types'; // Import your Snippet type

// function SnippetDisplay() {
//   const snippet = useRecoilValue(snippetState) as Snippet | null; // Explicitly type snippet

//   if (!snippet) {
//     return <div>Loading snippet...</div>;
//   }

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-2">Snippet Content</h2>
//       {snippet.canEdit ? (
//         <TextEditor
//           initialContent={snippet.content}
//           canEdit={snippet.canEdit} 
//           snippetId={snippet.id}
//         />
//       ) : (
//         <div className="whitespace-pre-wrap">{snippet.content}</div>
//       )}
//     </div>
//   );
// }

// export default SnippetDisplay;

// frontend/src/components/SnippetDisplay.tsx
import React from "react";
import { useRecoilValue } from "recoil";
import { snippetState } from "../state/atoms";
import TextEditor from "./TextEditor";
import { Snippet } from 'shared/types';

function SnippetDisplay() {
  const snippet = useRecoilValue(snippetState);

  if (!snippet) {
    // Handle case where snippet is not yet loaded (e.g., show loading indicator or error message)
    return <div>Loading snippet...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Snippet Content</h2>

      {snippet.canEdit ? (
        <TextEditor
          initialContent={snippet.content}
          canEdit={snippet.canEdit}
          snippetId={snippet._id as string}
        />
      ) : (
        <div className="whitespace-pre-wrap">
          {snippet.content.getText("content").toString()}
        </div> // Read-only view
      )}
    </div>
  );
}

export default SnippetDisplay;


