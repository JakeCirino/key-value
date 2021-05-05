import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

/**
 * Filename store service stores key/value pairs in
 */
const fileName: string = 'storage.json';

@Injectable()
export class StoreService {
    private keystore: Map<string, string> | null = null;
    
    /**
     * Loads the datastore file into this.keystore
     * @returns {Promise<boolean>} The result of the get operation
     */
    private async loadFile(): Promise<boolean>{
        try{
            const result: Buffer = await readFile(fileName);
            
            //parse json to map object
            const json: [key: string] = JSON.parse(result.toString());
            this.keystore = new Map<string, string>();
            for (const key in json) {
                if (Object.prototype.hasOwnProperty.call(json, key)) {
                    const value = json[key];
                    this.keystore.set(key, value);
                }
            }
            
            return true;
        }catch(error){
            //keystore file doesnt exist, create a new one
            this.keystore = new Map<string, string>();
            return true;
        }
    }

    /**
     * Saves the datastore file to storage
     * @returns {Promise<boolean>} The result of the save operation
     */
    private async saveFile(): Promise<boolean>{
        try{
            //parse map object to json
            let json: any = {}
            this.keystore?.forEach((val: string, key: string, map: Map<string, string>) => {
                json[key] = val;
            })

            await writeFile(fileName, JSON.stringify(json));
            return true;
        }catch(error){
            return false;
        }
    }

    /**
     * Stores a key/value pair in the database
     * @param {string} key The key to store
     * @param {string} value The value to store
     * @returns {Promise<boolean>} The result of the put operation
     */
    async put(key: any, value: string): Promise<boolean>{
        if(this.keystore == null) await this.loadFile();

        if(this.keystore != null)
            this.keystore.set(key, value);
        return await this.saveFile();
    }

    /**
     * Gets the value of a keypair with a specified key
     * @param {string} key The key to retrieve the value for 
     * @returns {Promise<string>} The value for the corresponding keypair
     */
    async get(key: string): Promise<string | undefined>{
        if(this.keystore == null) await this.loadFile();

        return this.keystore?.get(key);
    }

    /**
     * Deletes a keypair
     * @param {string} key The key to store
     * @returns {Promise<boolean>} The result of the delete operation
     */
    async delete(key: string): Promise<boolean>{
        if(this.keystore == null) await this.loadFile();
        
        if(!this.keystore?.has(key)) return false;

        this.keystore?.delete(key);
        return await this.saveFile();
    }
}
