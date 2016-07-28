/*
 * Typescript global JS declaration file
 * Add here all JS variables and functions
 * so TS compiles is aware of them and they can
 * be used in TS code.
 */

// Tealium variables
declare var utag_data: any;
interface utagConstructor {
    view(data: Object): boolean; 
    link(data: Object): boolean;
}
declare var utag: utagConstructor;