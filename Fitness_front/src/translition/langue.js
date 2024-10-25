import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Planfit Exercises Guide": "Planfit Exercises Guide",
      "Sign In": "Sign In",
      "Login": 'Login',
      "Sign Up": 'Sign Up',
      "createAccount": 'Create account',
      "Weight Loss": "Weight Loss",
      "Classic Yoga": "Classic Yoga",
      "Cycling": "Cycling",
      "Body Building": "Body Building",
      "Musculation": "Musculation",
      "Fitness Running": "Fitness Running",
      "Keep your body healthy & in shape": "Keep your body healthy & in shape",
      "In order to stay in shape and stay healthy, it is necessary to take a variety of steps, including a balanced diet and regular exercise.": "In order to stay in shape and stay healthy, it is necessary to take a variety of steps, including a balanced diet and regular exercise.",
      "Weight loss can have causes that aren't due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food.":"Weight loss can have causes that aren't due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food.",
      "The term 'yoga' in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.":"The term 'yoga' in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.",
      "Cycling, also, when on a two-wheeled bicycle, called bicycling or biking, is the use of cycles for transport, recreation, exercise or sport.":"Cycling, also, when on a two-wheeled bicycle, called bicycling or biking, is the use of cycles for transport, recreation, exercise or sport.",
      "Bodybuilding is the use of progressive resistance exercise to control and develop one's muscles by muscle hypertrophy for aesthetic purposes.":"Bodybuilding is the use of progressive resistance exercise to control and develop one's muscles by muscle hypertrophy for aesthetic purposes.",
      "Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength.":"Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength.",
      "Running is a method of dynamic terrestrial locomotion allowing humans and other animals to move quickly and rapidly on foot with great efficiency.":"Running is a method of dynamic terrestrial locomotion allowing humans and other animals to move quickly and rapidly on foot with great efficiency.",
      
      "By continuing, I agree to the terms of use & privacy policy": "By continuing, I agree to the terms of use & privacy policy",
      "Create a new account": "Create a new account",
      "Click here": "Click here",
      "Already have an account?":"Already have an account?",
      "Login here":"Login here"

    },
  },
  fr: {
    translation: {
      "Planfit Exercises Guide": "Guide des exercices Planfit",
      "Sign In": "Inscription",
      "Login": 'Connexion',
      "Sign Up": 'Inscription',
      "createAccount": 'Créer un compte', 
      "Weight Loss": "Perte de poids",
      "Classic Yoga": "Yoga classique",
      "Cycling": "Cyclisme",
      "Body Building": "Musculation",
      "Musculation": "Musculation",
      "Fitness Running": "Course à pied fitness",
      "Keep your body healthy & in shape": "Gardez votre corps en bonne santé et en forme",
      "In order to stay in shape and stay healthy, it is necessary to take a variety of steps, including a balanced diet and regular exercise.": "Pour rester en forme et en bonne santé, il est nécessaire de prendre une variété de mesures, y compris un régime alimentaire équilibré et un exercice régulier.",
      "Weight loss can have causes that aren't due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food.":"La perte de poids peut avoir des causes qui ne sont pas dues à une maladie sous-jacente. Par exemple, le régime, l'exercice, la malnutrition ou le manque d'accès à la nourriture.",
      "The term 'yoga' in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.":"Le terme 'yoga' dans le monde occidental désigne souvent une forme moderne de Hatha yoga, axée sur la condition physique basée sur des postures et la réduction du stress.",
      "Cycling, also, when on a two-wheeled bicycle, called bicycling or biking, is the use of cycles for transport, recreation, exercise or sport.":"Le cyclisme, également appelé bicyclette ou vélo lorsqu'il s'agit d'un vélo à deux roues, est l'utilisation de cycles pour le transport, les loisirs, l'exercice ou le sport.",
      "Bodybuilding is the use of progressive resistance exercise to control and develop one's muscles by muscle hypertrophy for aesthetic purposes.":"La musculation est l'utilisation d'exercices de résistance progressive pour contrôler et développer ses muscles par hypertrophie musculaire à des fins esthétiques.",
      "Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength.":"Le renforcement musculaire est un type d'entraînement de force couramment utilisé pour développer la force, la taille des muscles squelettiques et maintenir la force.",
      "Running is a method of dynamic terrestrial locomotion allowing humans and other animals to move quickly and rapidly on foot with great efficiency.":"La course est une méthode de locomotion terrestre dynamique permettant aux humains et à d'autres animaux de se déplacer rapidement et efficacement à pied.",
      
      "By continuing, I agree to the terms of use & privacy policy": "En continuant, j'accepte les conditions d'utilisation et la politique de confidentialité",
      "Create a new account": "Créer un nouveau compte",
      "Click here": "Cliquez ici",
      "Already have an account?":"Vous avez déjà un compte?",
      "Login here":"Connectez-vous ici"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en', 
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;
