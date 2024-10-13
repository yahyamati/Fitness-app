package model.entity;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "User")
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {

   @Column(name = "userID")
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String email;
   
   private String password;


   public void setPassword() {
      BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
      this.password = encoder.encode(password); // encode password
   }

   public String getPassword() {
      return password;
   }






}
