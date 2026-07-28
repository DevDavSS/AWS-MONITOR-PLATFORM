import { useEffect, useState } from "react";
import { getCacheStatus } from "@/services/cacheMetadataService";


export function useCacheStatus(){

    const [lastUpdated,setLastUpdated] =
        useState<number | null>(null);

    const [nextUpdate,setNextUpdate] =
        useState<number | null>(null);


    const loadStatus = async()=>{

        try{

            const data = await getCacheStatus();

            setLastUpdated(data.lastUpdated);

            setNextUpdate(data.nextUpdate);

        }catch(error){

            console.error(error);

        }

    };


    useEffect(()=>{

        loadStatus();

        const interval = setInterval(()=>{

            loadStatus();

        },60000);


        return()=>clearInterval(interval);


    },[]);


    return {
        lastUpdated,
        nextUpdate
    };

}