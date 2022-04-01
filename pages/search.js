import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import {BsFilter} from 'react-icons/bs';
import SearchFilters from "../components/SearchFilters";
import Property from "../components/Property";
import noresult from '../assets/noresult.svg'
import { fetchApi, baseUrl} from "../utils/fetchApi";
function search({properties}) {

    const [searchFilters, setSearchFilters] = useState(false);
    const router = useRouter()

  return (
    <Box>
        <Flex
          cursor={"pointer"}
          bg="gray.100"
          borderBottom={"1px"}
          borderColor="gray.200"
          p={"2"}
          fontWeight="black"
          fontSize={"large"}
          justifyContent="center"
          alignItems={"center"}
          onClick={()=>setSearchFilters((prevFilters)=> !prevFilters)}
          >
            <Text>Search properties by filters</Text>
            <Icon paddingLeft={"2"} as={BsFilter} />
        </Flex>
        {searchFilters && <SearchFilters />}
        <Text fontSize={"2xl"} p="4" fontWeight={"bold"}>
            Properties {router.query.purpose}
            {/* this router will display on screen what is mention in url i.e Properties "For sale" if  for sale is clicked in menu button*/}
        </Text>
        <Flex flexWrap={"wrap"}>
            {properties.map((property)=> <Property property={property} id={property.id}/>)}
        </Flex>
        {properties.length===0 && (
            <Flex justifyContent={"center"} alignItems="center" flexDirection={"column"} marginTop="5" marginBottom={"5"}>
                <Image src={noresult} alt="No result"/>
                <Text fontSize={"2xl"} marginTop="3">No Result Found</Text>
            </Flex>
        )}
    </Box>
  )
}



export async function getServerSideProps({ query }) {
    const purpose = query.purpose || 'for-rent';
    const rentFrequency = query.rentFrequency || 'yearly';
    const minPrice = query.minPrice || '0';
    const maxPrice = query.maxPrice || '1000000';
    const roomsMin = query.roomsMin || '0';
    const bathsMin = query.bathsMin || '0';
    const sort = query.sort || 'price-desc';
    const areaMax = query.areaMax || '35000';
    const locationExternalIDs = query.locationExternalIDs || '5002';
    const categoryExternalID = query.categoryExternalID || '4';
  
    const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);
  
    return {
      props: {
        properties: data?.hits,
      },
    };
  }
  
export default search