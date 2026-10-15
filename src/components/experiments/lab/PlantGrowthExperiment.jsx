import React from 'react';
import SimulationLab from '@/components/experiments/lab/SimulationLab';
import PlantGrowthScene from '@/components/experiments/lab/PlantGrowthScene';
import { plantGrowthModel } from '@/components/experiments/lab/plantGrowthModel';
export default function PlantGrowthExperiment() {
  return <SimulationLab definition={plantGrowthModel} Scene={PlantGrowthScene} />;
}