// // components/RedirectProvider.tsx
// import React, { createContext, ReactNode, useContext, useState } from 'react';
// import { RedirectContextProps } from '../types/Types';

// const RedirectContext = createContext<RedirectContextProps>({
//     isRedirected: false,
//     setIsRedirected: () => { },
// });

// export const RedirectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [isRedirected, setIsRedirected] = useState(false);


//     return (
//         <RedirectContext.Provider value={{ isRedirected, setIsRedirected }}>
//             {children}
//         </RedirectContext.Provider>
//     );
// };

// export const useRedirect = () => useContext(RedirectContext);
