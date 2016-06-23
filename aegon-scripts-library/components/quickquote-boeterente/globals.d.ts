declare var utag_data: any;
interface utagConstructor {
    view(data: Object): boolean; 
    link(data: Object): boolean;
}
declare var utag: utagConstructor;