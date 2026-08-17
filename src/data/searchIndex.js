// src/data/searchIndex.js
import { timelineData } from "./scriptures";
import { mapLocations } from "./mapLocations";
import { familyTreeData } from "./familyTree";

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

  return items;
}