package com.smartbook.appointment_system.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    private String jwtSecret = "mySmartBookingProjectSuperSecretKey1234567890";
    private int jwtExpirationMs = 86400000;

    public  String generateToken(Authentication authentication){
        try{
            UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

            String token =  Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime()+jwtExpirationMs))
                    .signWith(SignatureAlgorithm.HS256,jwtSecret)
                    .compact();

            logger.info("Token generated successfully for user: {}",userPrincipal.getUsername());
            return token;
        } catch (Exception e) {
            logger.error("Token generation failed: {}", e.getMessage());
            return null;
        }

    }
    public String getUserNameFromJwtToken(String token){
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken){
        try{
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        }
        catch (Exception e){

        }
        return false;
    }

}
