// src/data/searchIndex.js
import { timelineData } from "./scriptures";
import { mapLocations } from "./mapLocations";
import { familyTreeData } from "./familyTree";
import { kurukshetraWarData } from "./kurukshetraData"; 
import { weaponsData } from "./weaponsData"; 

export function getSearchableItems() {
  const items = [];

  // 1. Index Chapters
  timelineData.forEach((chapter, index) => {
    items.push({
      id: `chapter-${index}`,
      type: "chapter",
      title: chapter.title || `Chapter ${index + 1}`,
      subtitle: `Era / Chapter ${index + 1}`,
      index: index,
    });
  });

  // 2. Index Map Locations
  mapLocations.forEach((loc) => {
    items.push({
      id: `location-${loc.id}`,
      type: "location",
      title: loc.name,
      subtitle: "Map Location",
      data: loc,
    });
  });

  // 3. Index Characters from Generation-based familyTreeData
  if (Array.isArray(familyTreeData)) {
    familyTreeData.forEach((gen) => {
      if (Array.isArray(gen.characters)) {
        gen.characters.forEach((char) => {
          items.push({
            id: `character-${char.name.toLowerCase().replace(/\s+/g, "-")}`,
            type: "character",
            title: char.name,
            subtitle: `${gen.generation} — ${char.title || "Dynasty Character"}`,
            data: char,
          });
        });
      }
    });
  }

  // 4. Index Kurukshetra War Days
  if (Array.isArray(kurukshetraWarData)) {
    kurukshetraWarData.forEach((day, index) => {
      items.push({
        id: `war-day-${index}`,
        type: "war-day",
        title: day.title, // e.g., "Duryodhana's Fall & The End of War"
        subtitle: `Kurukshetra War — ${day.era}`, // e.g., "Kurukshetra War — Day 18"
        index: index, // Passes the index so page.js knows which day to open
      });
    });
  }

  // 5. Index Astras and Divine Weapons
  if (Array.isArray(weaponsData)) {
    weaponsData.forEach((weapon) => {
      items.push({
        id: `weapon-${weapon.id}`, // Pulls the exact string ID (e.g., "vajra")
        type: "weapon",
        title: weapon.name, // e.g., "Vajra"
        subtitle: `${weapon.type} — Wielded by ${weapon.wielder}`, // e.g., "Divine Weapon — Wielded by Indra / Arjuna"
        data: weapon, // Passes the full weapon object for your modal
      });
    });
  }

  return items;
}