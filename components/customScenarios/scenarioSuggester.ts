import { useState } from 'react';

const userRoles = [
  "a tourist", "a stand-up comedian", "a time traveler", "a secret agent", "a reality TV contestant",
  "a superhero in disguise", "a ghost hunter", "a food critic", "a mad scientist", "an alien diplomat"
];

const situations = [
  "lost in a maze-like IKEA store", "accidentally joined a flash mob", "stuck in an elevator with a celebrity",
  "participating in a hot dog eating contest", "trying to return an item without a receipt",
  "auditioning for a role in a blockbuster movie", "attempting to break a world record",
  "organizing a last-minute surprise party", "learning to surf for the first time",
  "accidentally switched phones with a spy"
];

const aiNames = [
  "Zoe", "Xander", "Luna", "Finn", "Nova", "Kai", "Aria", "Leo", "Ivy", "Max",
  "Cleo", "Axel", "Sage", "Rex", "Skye", "Jett", "Roxy", "Zane", "Echo", "Dash"
];

const aiRoles = [
  "store manager", "dance instructor", "time police officer", "gadget expert", "game show host",
  "fashion designer", "paranormal investigator", "renowned chef", "eccentric inventor", "intergalactic tour guide"
];

const aiTraits = [
  "overly enthusiastic", "comically serious", "absurdly logical", "dramatically poetic",
  "constantly quoting movies", "speaking only in rhymes", "obsessed with puns",
  "thinking everything is a conspiracy", "extremely superstitious", "hilariously clumsy"
];

const objectives = [
  "learn the secret handshake", "acquire the legendary golden spatula",
  "decipher the ancient meme prophecy", "win the annual rubber duck race",
  "master the art of extreme origami", "become the king of dad jokes",
  "uncover the truth about the missing socks", "organize a flash mob of mimes",
  "train a team of squirrels for a heist", "start an interspecies book club"
];

const generateScenario = () => {
  const userRole = userRoles[Math.floor(Math.random() * userRoles.length)];
  const situation = situations[Math.floor(Math.random() * situations.length)];
  const aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
  const aiRole = aiRoles[Math.floor(Math.random() * aiRoles.length)];
  const aiTrait = aiTraits[Math.floor(Math.random() * aiTraits.length)];
  const objective = objectives[Math.floor(Math.random() * objectives.length)];

  const scenarioText = `I'm ${userRole} who is ${situation}. ${aiName}, a ${aiRole}, is approaching. ${aiName} seems to be ${aiTrait}. I'll try to ${objective}.`;

  return {
    scenarioText,
    aiName,
    aiRole
  };
};

export const useScenarioSuggester = () => {
  const [scenario, setScenario] = useState('');
  const [aiName, setAiName] = useState('');
  const [aiRole, setAiRole] = useState('');

  const handleSuggest = () => {
    const newScenario = generateScenario();
    setScenario(newScenario.scenarioText);
    setAiName(newScenario.aiName);
    setAiRole(newScenario.aiRole);
  };

  const updateScenario = (newScenario: string) => {
    setScenario(newScenario);
    if (newScenario !== scenario) {
      setAiName('');
      setAiRole('');
    }
  };

  return { scenario, setScenario: updateScenario, aiName, setAiName, aiRole, setAiRole, handleSuggest };
};