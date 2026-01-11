export interface MenuItemType{
    id:string;
    title:string;
    path:string;
    children?: MenuItemType[];
}
