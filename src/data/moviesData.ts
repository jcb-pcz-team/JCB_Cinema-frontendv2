export const moviesData: {
    title: string,
    duration: string,
    genre: string[],
    description: string,
    image: string,
    ageRestriction: string,
    screeningType: string[], // Dodane pole screeningType
}[] = [
    {
        title: "The Mandalorian",
        duration: "1H 32M",
        genre: ["Action", "Sci-Fi"],
        description: "Set years after 'Return of the Jedi' in the Outer Rim, where few care about the Empire's fall, the story follows a lone Mandalorian bounty hunter, marked by his iconic armor.",
        image: "src/assets/images/backgorund-mandalorian.png",
        ageRestriction: "13+",
        screeningType: ["2D", "IMAX"], // Typy seansów
    },
    {
        title: "Furiosa: Saga Mad Max",
        duration: "2H 38M",
        genre: ["Action", "Sci-Fi"],
        description: "When the world collapses, young Furiosa is captured by the Biker Horde and taken to the Citadel, where Immortan Joe reigns. Faced with a clash between two tyrants for power, Furiosa must survive numerous trials and gather the means to return home.",
        image: "src/assets/images/backgorund-furiosa.png",
        ageRestriction: "18+",
        screeningType: ["3D", "IMAX"],
    },
    {
        title: "Alien: Romulus",
        duration: "1H 59M",
        genre: ["Horror", "Sci-Fi"],
        description: "As the world collapses, young Furiosa is captured by the Biker Horde and taken to the Citadel, ruled by Immortan Joe. Amid a power struggle between two tyrants, Furiosa must endure harsh trials and gather the means to return home.",
        image: "src/assets/images/backgorund-alien.png",
        ageRestriction: "18+",
        screeningType: ["2D"],
    },
    {
        title: "Spider Man: No Way Home",
        duration: "2H 30M",
        genre: ["Action", "Sci-Fi"],
        description: "For the first time in history, the identity of Spider-Man, our friendly neighborhood superhero, is revealed. He can no longer fulfill his superhero duties while leading a normal life. Moreover, he puts those he cares about most in danger.",
        image: "src/assets/images/backgorund-spiderman.png",
        ageRestriction: "13+",
        screeningType: ["2D", "3D"],
    },
    {
        title: "Interstellar",
        duration: "2H 49M",
        genre: ["Sci-Fi"],
        description: "Due to mistakes made by humanity in the 20th century, Earth now stands on the brink of destruction. Nations have fallen, and their governments have lost power. The barely functioning economy can no longer even provide people with food. However, when the possibility of space-time travel is discovered, scientists from the remnants of NASA decide to investigate it, becoming humanity's last hope for survival and the salvation of their planet.",
        image: "src/assets/images/background-interstellar.png",
        ageRestriction: "13+",
        screeningType: ["2D", "IMAX"],
    }
];
