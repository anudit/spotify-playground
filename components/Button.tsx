import React from 'react';
import { Button } from "@chakra-ui/react";

export default function SpButton({children, ...props}){
    return (
        <Button  minW="200px" maxWidth='200px'  backgroundColor="#1DB954" textTransform='uppercase' fontSize='xs' letterSpacing='2px' fontWeight='bold' _hover={{backgroundColor:"#1ed760", color:"white"}} borderRadius={100} {...props}>
            {children}
        </Button>
    )
}