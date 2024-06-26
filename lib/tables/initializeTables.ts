import * as cdk from 'aws-cdk-lib';
import { TagsTable } from "./TagsTable";
import { CategoriesTable } from './CategoriesTable';
import { ItemsTable } from './ItemsTable';
import { Table } from 'aws-cdk-lib/aws-dynamodb';



export const initializeTables = (stack: cdk.Stack) => {
    const tagsTable: Table = new TagsTable(stack).table;
    const categoriesTable: Table = new CategoriesTable(stack).table;
    const itemsTable: Table = new ItemsTable(stack).table;

    return {
        tagsTable,
        categoriesTable,
        itemsTable,
    };
}