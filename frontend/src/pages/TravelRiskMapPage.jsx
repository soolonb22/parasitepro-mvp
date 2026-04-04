import * as topojson from 'topojson-client';
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryToRegion = {
  'USA': 'north-america', 'CAN': 'north-america', 'MEX': 'central-america',
  'GTM': 'central-america', 'BLZ': 'central-america', 'SLV': 'central-america',
  'HND': 'central-america', 'NIC': 'central-america', 'CRI': 'central-america',
  'PAN': 'central-america', 'CUB': 'central-america', 'JAM': 'central-america',
  'HTI': 'central-america', 'DOM': 'central-america', 'PRI': 'central-america',
  'BHS': 'central-america', 'TTO': 'central-america',
  
  'BRA': 'south-america', 'ARG': 'south-america', 'COL': 'south-america',
  'PER': 'south-america', 'VEN': 'south-america', 'CHL': 'south-america',
  'ECU': 'south-america', 'BOL': 'south-america', 'PRY': 'south-america',
  'URY': 'south-america', 'GUY': 'south-america', 'SUR': 'south-america',
  'GUF': 'south-america',
  
  'GBR': 'western-europe', 'FRA': 'western-europe', 'DEU': 'western-europe',
  'ESP': 'western-europe', 'PRT': 'western-europe', 'ITA': 'western-europe',
  'NLD': 'western-europe', 'BEL': 'western-europe', 'CHE': 'western-europe',
  'AUT': 'western-europe', 'IRL': 'western-europe', 'DNK': 'western-europe',
  'NOR': 'western-europe', 'SWE': 'western-europe', 'FIN': 'western-europe',
  'ISL': 'western-europe', 'LUX': 'western-europe', 'GRC': 'western-europe',
  
  'RUS': 'eastern-europe', 'UKR': 'eastern-europe', 'POL': 'eastern-europe',
  'ROU': 'eastern-europe', 'CZE': 'eastern-europe', 'HUN': 'eastern-europe',
  'BGR': 'eastern-europe', 'SRB': 'eastern-europe', 'SVK': 'eastern-europe',
  'BLR': 'eastern-europe', 'MDA': 'eastern-europe', 'LTU': 'eastern-europe',
  'LVA': 'eastern-europe', 'EST': 'eastern-europe', 'HRV': 'eastern-europe',
  'BIH': 'eastern-europe', 'SVN': 'eastern-europe', 'MKD': 'eastern-europe',
  'ALB': 'eastern-europe', 'MNE': 'eastern-europe', 'KAZ': 'eastern-europe',
  'UZB': 'eastern-europe', 'TKM': 'eastern-europe', 'KGZ': 'eastern-europe',
  'TJK': 'eastern-europe', 'AZE': 'eastern-europe', 'GEO': 'eastern-europe',
  'ARM': 'eastern-europe',
  
  'MAR': 'north-africa-middle-east', 'DZA': 'north-africa-middle-east',
  'TUN': 'north-africa-middle-east', 'LBY': 'north-africa-middle-east',
  'EGY': 'north-africa-middle-east', 'SDN': 'north-africa-middle-east',
  'SAU': 'north-africa-middle-east', 'YEM': 'north-africa-middle-east',
  'OMN': 'north-africa-middle-east', 'ARE': 'north-africa-middle-east',
  'QAT': 'north-africa-middle-east', 'BHR': 'north-africa-middle-east',
  'KWT': 'north-africa-middle-east', 'IRQ': 'north-africa-middle-east',
  'SYR': 'north-africa-middle-east', 'JOR': 'north-africa-middle-east',
  'LBN': 'north-africa-middle-east', 'ISR': 'north-africa-middle-east',
  'PSE': 'north-africa-middle-east', 'IRN': 'north-africa-middle-east',
  'TUR': 'north-africa-middle-east', 'CYP': 'north-africa-middle-east',
  'AFG': 'south-asia', 'ESH': 'north-africa-middle-east',
  'MRT': 'north-africa-middle-east',
  
  'NGA': 'sub-saharan-africa', 'ETH': 'sub-saharan-africa', 'COD': 'sub-saharan-africa',
  'TZA': 'sub-saharan-africa', 'ZAF': 'sub-saharan-africa', 'KEN': 'sub-saharan-africa',
  'UGA': 'sub-saharan-africa', 'GHA': 'sub-saharan-africa', 'MOZ': 'sub-saharan-africa',
  'MDG': 'sub-saharan-africa', 'CIV': 'sub-saharan-africa', 'CMR': 'sub-saharan-africa',
  'AGO': 'sub-saharan-africa', 'NER': 'sub-saharan-africa', 'BFA': 'sub-saharan-africa',
  'MLI': 'sub-saharan-africa', 'MWI': 'sub-saharan-africa', 'ZMB': 'sub-saharan-africa',
  'SEN': 'sub-saharan-africa', 'TCD': 'sub-saharan-africa', 'SOM': 'sub-saharan-africa',
  'ZWE': 'sub-saharan-africa', 'GIN': 'sub-saharan-africa', 'RWA': 'sub-saharan-africa',
  'BDI': 'sub-saharan-africa', 'BEN': 'sub-saharan-africa', 'TGO': 'sub-saharan-africa',
  'SLE': 'sub-saharan-africa', 'LBR': 'sub-saharan-africa', 'CAF': 'sub-saharan-africa',
  'COG': 'sub-saharan-africa', 'GAB': 'sub-saharan-africa', 'GNQ': 'sub-saharan-africa',
  'NAM': 'sub-saharan-africa', 'BWA': 'sub-saharan-africa', 'LSO': 'sub-saharan-africa',
  'SWZ': 'sub-saharan-africa', 'GMB': 'sub-saharan-africa', 'GNB': 'sub-saharan-africa',
  'ERI': 'sub-saharan-africa', 'DJI': 'sub-saharan-africa', 'SSD': 'sub-saharan-africa',
  
  'IND': 'south-asia', 'PAK': 'south-asia', 'BGD': 'south-asia',
  'NPL': 'south-asia', 'LKA': 'south-asia', 'BTN': 'south-asia',
  'MDV': 'south-asia',
  
  'CHN': 'east-asia', 'JPN': 'east-asia', 'KOR': 'east-asia',
  'PRK': 'east-asia', 'MNG': 'east-asia', 'TWN': 'east-asia',
  
  'THA': 'southeast-asia', 'VNM': 'southeast-asia', 'MMR': 'southeast-asia',
  'MYS': 'southeast-asia', 'IDN': 'southeast-asia', 'PHL': 'southeast-asia',
  'KHM': 'southeast-asia', 'LAO': 'southeast-asia', 'SGP': 'southeast-asia',
  'BRN': 'southeast-asia', 'TLS': 'southeast-asia',
  
  'AUS': 'oceania', 'NZL': 'oceania', 'PNG': 'oceania',
  'FJI': 'oceania', 'SLB': 'oceania', 'VUT': 'oceania',
  'NCL': 'oceania', 'WSM': 'oceania',
  
  'GRL': 'north-america'
};

const countryIdToCode = {
  '4': 'AFG', '8': 'ALB', '12': 'DZA', '24': 'AGO', '32': 'ARG', '36': 'AUS',
  '40': 'AUT', '50': 'BGD', '56': 'BEL', '68': 'BOL', '70': 'BIH', '72': 'BWA',
  '76': 'BRA', '100': 'BGR', '104': 'MMR', '108': 'BDI', '112': 'BLR', '116': 'KHM',
  '120': 'CMR', '124': 'CAN', '140': 'CAF', '148': 'TCD', '152': 'CHL', '156': 'CHN',
  '170': 'COL', '178': 'COG', '180': 'COD', '188': 'CRI', '191': 'HRV', '192': 'CUB',
  '196': 'CYP', '203': 'CZE', '208': 'DNK', '214': 'DOM', '218': 'ECU', '818': 'EGY',
  '222': 'SLV', '226': 'GNQ', '232': 'ERI', '233': 'EST', '231': 'ETH', '246': 'FIN',
  '250': 'FRA', '266': 'GAB', '270': 'GMB', '268': 'GEO', '276': 'DEU', '288': 'GHA',
  '300': 'GRC', '304': 'GRL', '320': 'GTM', '324': 'GIN', '328': 'GUY', '332': 'HTI',
  '340': 'HND', '348': 'HUN', '352': 'ISL', '356': 'IND', '360': 'IDN', '364': 'IRN',
  '368': 'IRQ', '372': 'IRL', '376': 'ISR', '380': 'ITA', '384': 'CIV', '388': 'JAM',
  '392': 'JPN', '400': 'JOR', '398': 'KAZ', '404': 'KEN', '408': 'PRK', '410': 'KOR',
  '414': 'KWT', '417': 'KGZ', '418': 'LAO', '428': 'LVA', '422': 'LBN', '426': 'LSO',
  '430': 'LBR', '434': 'LBY', '440': 'LTU', '442': 'LUX', '450': 'MDG', '454': 'MWI',
  '458': 'MYS', '466': 'MLI', '478': 'MRT', '484': 'MEX', '496': 'MNG', '498': 'MDA',
  '504': 'MAR', '508': 'MOZ', '516': 'NAM', '524': 'NPL', '528': 'NLD', '554': 'NZL',
  '558': 'NIC', '562': 'NER', '566': 'NGA', '578': 'NOR', '512': 'OMN', '586': 'PAK',
  '591': 'PAN', '598': 'PNG', '600': 'PRY', '604': 'PER', '608': 'PHL', '616': 'POL',
  '620': 'PRT', '634': 'QAT', '642': 'ROU', '643': 'RUS', '646': 'RWA', '682': 'SAU',
  '686': 'SEN', '688': 'SRB', '694': 'SLE', '702': 'SGP', '703': 'SVK', '705': 'SVN',
  '706': 'SOM', '710': 'ZAF', '728': 'SSD', '724': 'ESP', '144': 'LKA', '729': 'SDN',
  '740': 'SUR', '748': 'SWZ', '752': 'SWE', '756': 'CHE', '760': 'SYR', '762': 'TJK',
  '834': 'TZA', '764': 'THA', '768': 'TGO', '780': 'TTO', '788': 'TUN', '792': 'TUR',
  '795': 'TKM', '800': 'UGA', '804': 'UKR', '784': 'ARE', '826': 'GBR', '840': 'USA',
  '858': 'URY', '860': 'UZB', '862': 'VEN', '704': 'VNM', '732': 'ESH', '887': 'YEM',
  '894': 'ZMB', '716': 'ZWE'
};

const regionData = {
  'sub-saharan-africa': {
    name: 'Sub-Saharan Africa',
    riskLevel: 'critical',
    riskScore: 95,
    color: '#dc2626',
    statistics: {
      malariaPrevalence: '95% of global malaria cases & deaths',
      malariaCases: '268 million cases/year (WHO 2024)',
      malariaDeaths: '579,000 deaths/year (95% of global)',
      sthPrevalence: 'Very High - 24% children infected',
      schistosomiasis: '127 million infected (84% of global)',
      affectedPopulation: '700+ million at risk'
    },
    parasites: [
      { name: 'Plasmodium falciparum (Malaria)', prevalence: '268M cases, 579K deaths/year', severity: 'critical' },
      { name: 'Schistosoma haematobium/mansoni', prevalence: '127M infected (84% of global)', severity: 'high' },
      { name: 'Soil-transmitted helminths', prevalence: '24% children, 350M+ at risk', severity: 'high' },
      { name: 'Trypanosoma brucei (Sleeping Sickness)', prevalence: 'Endemic in 36 countries', severity: 'critical' },
      { name: 'Onchocerca volvulus (River Blindness)', prevalence: '21M infected', severity: 'high' },
      { name: 'Wuchereria bancrofti (Lymphatic Filariasis)', prevalence: '65M at risk', severity: 'high' }
    ],
    precautions: [
      'Take antimalarial prophylaxis (consult travel clinic)',
      'Sleep under insecticide-treated bed nets',
      'Use DEET-based insect repellent (30-50%)',
      'Avoid freshwater swimming (schistosomiasis)',
      'Drink only bottled/boiled water',
      'Wear protective clothing and closed shoes'
    ],
    countries: ['Nigeria', 'DRC', 'Tanzania', 'Kenya', 'Ethiopia', 'Ghana', 'Cameroon', 'Mozambique'],
    dataSource: 'WHO World Malaria Report 2024, GBD 2021'
  },
  'south-asia': {
    name: 'South Asia',
    riskLevel: 'high',
    riskScore: 75,
    color: '#f97316',
    statistics: {
      malariaPrevalence: '2% of global cases (WHO 2024)',
      malariaCases: '5.5 million cases/year',
      malariaDeaths: '8,200 deaths/year',
      sthPrevalence: 'High - 24% Ascaris, 16% Trichuris',
      lymphaticFilariasis: '400 million at risk (India #1)',
      affectedPopulation: '600+ million at risk'
    },
    parasites: [
      { name: 'Ascaris lumbricoides', prevalence: '24% in school-age children', severity: 'high' },
      { name: 'Hookworm (Ancylostoma/Necator)', prevalence: '10% prevalence', severity: 'moderate' },
      { name: 'Giardia lamblia', prevalence: '8-30% in children', severity: 'moderate' },
      { name: 'Entamoeba histolytica', prevalence: '10-15% symptomatic', severity: 'high' },
      { name: 'Wuchereria bancrofti', prevalence: '40% global LF burden in India', severity: 'high' },
      { name: 'Plasmodium vivax (Malaria)', prevalence: '5.5M cases/year', severity: 'high' }
    ],
    precautions: [
      'Drink only bottled or boiled water',
      'Avoid street food and raw vegetables',
      'Use insect repellent, especially at dusk',
      'Never walk barefoot outdoors',
      'Wash hands frequently with soap',
      'Consider malaria prophylaxis for some areas'
    ],
    countries: ['India', 'Bangladesh', 'Pakistan', 'Nepal', 'Sri Lanka', 'Afghanistan'],
    dataSource: 'WHO 2024, CDC Yellow Book 2024'
  },
  'southeast-asia': {
    name: 'Southeast Asia',
    riskLevel: 'high',
    riskScore: 70,
    color: '#f97316',
    statistics: {
      malariaPrevalence: '2% of global burden (WHO 2024)',
      malariaCases: '6.5 million cases/year',
      malariaDeaths: '9,100 deaths/year',
      sthPrevalence: 'Moderate - 15-25% children',
      liverFlukes: '35 million infected globally (highest burden)',
      affectedPopulation: '350+ million at risk'
    },
    parasites: [
      { name: 'Opisthorchis viverrini (Liver Fluke)', prevalence: '10M+ in Mekong region', severity: 'high' },
      { name: 'Clonorchis sinensis', prevalence: '15M infected (Vietnam/Korea)', severity: 'high' },
      { name: 'Strongyloides stercoralis', prevalence: '10-40% in endemic areas', severity: 'moderate' },
      { name: 'Plasmodium spp. (Malaria)', prevalence: '6.5M cases, border areas', severity: 'high' },
      { name: 'Hookworm', prevalence: '10% in rural areas', severity: 'moderate' },
      { name: 'Paragonimus (Lung Fluke)', prevalence: 'Endemic from raw crabs', severity: 'moderate' }
    ],
    precautions: [
      'NEVER eat raw or undercooked freshwater fish',
      'Avoid raw crab/crayfish dishes',
      'Take malaria prophylaxis for border areas',
      'Use insect repellent in rural/forest areas',
      'Drink bottled water only',
      'Wash hands before eating'
    ],
    countries: ['Thailand', 'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Philippines', 'Indonesia', 'Malaysia'],
    dataSource: 'WHO 2024, CDC Yellow Book 2024'
  },
  'central-america': {
    name: 'Central America & Caribbean',
    riskLevel: 'high',
    riskScore: 65,
    color: '#f97316',
    statistics: {
      malariaPrevalence: '0.3% of global cases',
      malariaCases: '480,000 cases/year (Americas total)',
      chagasDisease: '6-7 million infected in Americas',
      sthPrevalence: 'Moderate - 12-18% children',
      dengue: 'Hyperendemic - 3M cases/year Americas',
      affectedPopulation: '120+ million at risk'
    },
    parasites: [
      { name: 'Trypanosoma cruzi (Chagas Disease)', prevalence: '6-7M infected in Americas', severity: 'critical' },
      { name: 'Ascaris lumbricoides', prevalence: '12-18% in children', severity: 'moderate' },
      { name: 'Hookworm', prevalence: 'Common in rural areas', severity: 'moderate' },
      { name: 'Strongyloides stercoralis', prevalence: '5-15%', severity: 'moderate' },
      { name: 'Cryptosporidium', prevalence: 'Waterborne outbreaks', severity: 'moderate' },
      { name: 'Entamoeba histolytica', prevalence: '8-10% symptomatic', severity: 'moderate' }
    ],
    precautions: [
      'Use insect repellent (Chagas risk from triatomine bugs)',
      'Sleep in well-screened or air-conditioned rooms',
      'Avoid sleeping in mud/thatch structures',
      'Drink bottled or boiled water',
      'Avoid raw vegetables/fruit you cannot peel',
      'Wear closed shoes in rural areas'
    ],
    countries: ['Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Haiti'],
    dataSource: 'WHO 2024, PAHO 2024'
  },
  'south-america': {
    name: 'South America',
    riskLevel: 'high',
    riskScore: 68,
    color: '#f97316',
    statistics: {
      malariaPrevalence: 'Amazon basin endemic',
      malariaCases: '620,000 cases/year (WHO 2024)',
      malariaDeaths: '540 deaths/year',
      sthPrevalence: '15-25% in endemic areas',
      chagas: '5.7 million infected (WHO 2024)',
      leishmaniasis: '55,000 cutaneous cases/year',
      affectedPopulation: '220+ million at risk'
    },
    parasites: [
      { name: 'Trypanosoma cruzi (Chagas Disease)', prevalence: '5.7M infected', severity: 'critical' },
      { name: 'Plasmodium spp. (Malaria)', prevalence: '620K cases/year Amazon', severity: 'high' },
      { name: 'Leishmania spp.', prevalence: '55K cutaneous cases/year', severity: 'high' },
      { name: 'Schistosoma mansoni', prevalence: 'Brazil - 1.5M infected', severity: 'moderate' },
      { name: 'Hookworm/Ascaris', prevalence: '15-25% rural areas', severity: 'moderate' },
      { name: 'Strongyloides stercoralis', prevalence: '10-30% endemic areas', severity: 'moderate' }
    ],
    precautions: [
      'Take malaria prophylaxis for Amazon travel',
      'Use 30%+ DEET repellent consistently',
      'Sleep under bed nets in endemic areas',
      'Avoid freshwater swimming in Brazil',
      'Protect against sandfly bites (leishmaniasis)',
      'Avoid sleeping in rural mud houses'
    ],
    countries: ['Brazil', 'Peru', 'Colombia', 'Venezuela', 'Bolivia', 'Ecuador', 'Paraguay', 'Argentina'],
    dataSource: 'WHO 2024, PAHO 2024'
  },
  'north-africa-middle-east': {
    name: 'North Africa & Middle East',
    riskLevel: 'moderate',
    riskScore: 50,
    color: '#eab308',
    statistics: {
      malariaPrevalence: 'Low - Egypt eliminated 2024',
      malariaCases: '3.8 million cases/year (EMR)',
      malariaDeaths: '5,600 deaths/year',
      sthPrevalence: 'Low to Moderate - 8-15%',
      leishmaniasis: '110,000 cutaneous cases/year (Syria endemic)',
      affectedPopulation: '160+ million at risk'
    },
    parasites: [
      { name: 'Schistosoma haematobium', prevalence: 'Egypt/Sudan - 5M at risk', severity: 'moderate' },
      { name: 'Leishmania spp.', prevalence: '110K cutaneous/year (Syria #1)', severity: 'moderate' },
      { name: 'Giardia lamblia', prevalence: '5-15% waterborne', severity: 'low' },
      { name: 'Ascaris/Hookworm', prevalence: '8-15% rural areas', severity: 'low' },
      { name: 'Fasciola hepatica', prevalence: 'Egypt/Iran endemic', severity: 'moderate' },
      { name: 'Hymenolepis nana', prevalence: '5-10% in children', severity: 'low' }
    ],
    precautions: [
      'Avoid swimming in Nile River/freshwater',
      'Drink bottled water',
      'Use insect repellent (sandfly protection)',
      'Standard food hygiene practices',
      'Avoid raw leafy vegetables in endemic areas',
      'Wash produce with clean water'
    ],
    countries: ['Egypt', 'Morocco', 'Tunisia', 'Sudan', 'Yemen', 'Saudi Arabia', 'Iran', 'Iraq', 'Turkey'],
    dataSource: 'WHO EMRO 2024, CDC 2024'
  },
  'east-asia': {
    name: 'East Asia',
    riskLevel: 'moderate',
    riskScore: 40,
    color: '#eab308',
    statistics: {
      malariaPrevalence: 'Eliminated (China 2021)',
      malariaCases: 'Imported cases only',
      sthPrevalence: 'Low - 5-10%',
      liverFlukes: '15-20 million infected regionally',
      anisakiasis: '2,000+ cases/year Japan',
      affectedPopulation: '80+ million at risk (liver flukes)'
    },
    parasites: [
      { name: 'Clonorchis sinensis', prevalence: '15M infected China/Korea', severity: 'moderate' },
      { name: 'Anisakis (from raw fish)', prevalence: '2,000+ cases/year Japan', severity: 'low' },
      { name: 'Taenia spp. (Tapeworm)', prevalence: 'Raw beef/pork consumption', severity: 'low' },
      { name: 'Paragonimus westermani', prevalence: 'Endemic from raw crabs', severity: 'moderate' },
      { name: 'Toxoplasma gondii', prevalence: '10-20% seroprevalence', severity: 'low' },
      { name: 'Enterobius vermicularis', prevalence: '5-15% in children', severity: 'low' }
    ],
    precautions: [
      'Avoid raw freshwater fish dishes',
      'Be cautious with sashimi from uncertain sources',
      'Cook pork thoroughly (taeniasis)',
      'Avoid raw crab/crayfish',
      'Standard hygiene practices sufficient',
      'Wash hands regularly'
    ],
    countries: ['China', 'Japan', 'South Korea', 'Taiwan', 'Mongolia'],
    dataSource: 'WHO WPRO 2024, CDC 2024'
  },
  'eastern-europe': {
    name: 'Eastern Europe & Central Asia',
    riskLevel: 'moderate',
    riskScore: 35,
    color: '#eab308',
    statistics: {
      malariaPrevalence: 'Eliminated (regional)',
      malariaCases: 'Imported only - 2024 certifications',
      sthPrevalence: 'Low - 3-8%',
      echinococcosis: '18,000 cases/year globally (endemic)',
      opisthorchiasis: '1.5M infected Siberia',
      affectedPopulation: '60+ million at risk'
    },
    parasites: [
      { name: 'Echinococcus granulosus/multilocularis', prevalence: '18K cases/year globally', severity: 'high' },
      { name: 'Giardia lamblia', prevalence: '5-10% waterborne', severity: 'low' },
      { name: 'Toxoplasma gondii', prevalence: '20-50% seroprevalence', severity: 'low' },
      { name: 'Diphyllobothrium latum (Fish tapeworm)', prevalence: 'Baltic/Siberia regions', severity: 'low' },
      { name: 'Opisthorchis felineus', prevalence: '1.5M infected Siberia', severity: 'moderate' },
      { name: 'Trichinella spiralis', prevalence: '100-200 cases/year EU', severity: 'moderate' }
    ],
    precautions: [
      'Avoid contact with stray dogs (echinococcosis)',
      'Cook wild game thoroughly (trichinellosis)',
      'Avoid raw freshwater fish in Siberia',
      'Drink bottled water in rural areas',
      'Wash wild berries thoroughly',
      'Practice standard food hygiene'
    ],
    countries: ['Russia', 'Ukraine', 'Poland', 'Romania', 'Bulgaria', 'Hungary', 'Kazakhstan'],
    dataSource: 'WHO EURO 2024, ECDC 2024'
  },
  'western-europe': {
    name: 'Western Europe',
    riskLevel: 'low',
    riskScore: 15,
    color: '#22c55e',
    statistics: {
      malariaPrevalence: 'Eliminated - imported only',
      malariaCases: '8,000 imported cases/year EU',
      sthPrevalence: 'Very Low - <2%',
      toxoplasmosis: '30-50% seroprevalence (varies)',
      cryptosporidiosis: '15,000 cases/year EU',
      affectedPopulation: 'Minimal endemic risk'
    },
    parasites: [
      { name: 'Toxoplasma gondii', prevalence: '30-50% seroprevalence', severity: 'low' },
      { name: 'Giardia lamblia', prevalence: '2-5% (travel-associated)', severity: 'low' },
      { name: 'Cryptosporidium', prevalence: '15K cases/year EU', severity: 'low' },
      { name: 'Enterobius vermicularis', prevalence: '5-15% in children', severity: 'low' },
      { name: 'Echinococcus (imported)', prevalence: '<500 cases/year EU', severity: 'low' },
      { name: 'Anisakis (raw fish)', prevalence: '500+ cases/year Spain', severity: 'low' }
    ],
    precautions: [
      'Standard food hygiene practices',
      'Wash produce thoroughly',
      'Cook meat to proper temperatures',
      'Pregnant women avoid cat litter',
      'Freeze fish before raw consumption',
      'Practice good handwashing'
    ],
    countries: ['UK', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland'],
    dataSource: 'ECDC 2024, WHO EURO 2024'
  },
  'north-america': {
    name: 'North America',
    riskLevel: 'low',
    riskScore: 12,
    color: '#22c55e',
    statistics: {
      malariaPrevalence: 'Eliminated - local cases rare',
      malariaCases: '2,000 imported cases/year US',
      sthPrevalence: 'Very Low - <1%',
      giardiasis: '15,000 cases/year US (CDC)',
      cryptosporidiosis: '8,000 cases/year US',
      affectedPopulation: 'Minimal endemic risk'
    },
    parasites: [
      { name: 'Giardia lamblia', prevalence: '15K cases/year US', severity: 'low' },
      { name: 'Toxoplasma gondii', prevalence: '11% seroprevalence US', severity: 'low' },
      { name: 'Enterobius vermicularis (Pinworm)', prevalence: '10-20% children', severity: 'low' },
      { name: 'Cryptosporidium', prevalence: '8K cases/year US', severity: 'low' },
      { name: 'Baylisascaris (raccoon roundworm)', prevalence: '<25 cases/year severe', severity: 'moderate' },
      { name: 'Cyclospora cayetanensis', prevalence: '2,000+ outbreak cases/year', severity: 'low' }
    ],
    precautions: [
      'Filter/treat water when camping',
      'Wash hands after animal contact',
      'Cook meat properly',
      'Wash imported produce well',
      'Keep children away from raccoon areas',
      'Standard food safety practices'
    ],
    countries: ['USA', 'Canada'],
    dataSource: 'CDC NNDSS 2024'
  },
  'oceania': {
    name: 'Australia & Oceania',
    riskLevel: 'low',
    riskScore: 18,
    color: '#22c55e',
    statistics: {
      malariaPrevalence: 'PNG endemic - 1.2M cases/year',
      malariaCases: 'PNG: 1.2M cases, 2,800 deaths/year',
      sthPrevalence: 'Low Australia (<5%), High PNG (40%+)',
      strongyloides: '60,000+ in Indigenous Australia',
      lymphaticFilariasis: 'Pacific Islands endemic',
      affectedPopulation: '12+ million at risk (Pacific)'
    },
    parasites: [
      { name: 'Strongyloides stercoralis', prevalence: '60K+ Indigenous Australia', severity: 'moderate' },
      { name: 'Plasmodium spp.', prevalence: 'PNG: 1.2M cases/year', severity: 'high' },
      { name: 'Giardia lamblia', prevalence: '5-10% waterborne', severity: 'low' },
      { name: 'Cryptosporidium', prevalence: '4,000 cases/year Australia', severity: 'low' },
      { name: 'Hookworm', prevalence: 'Northern Australia/Pacific', severity: 'moderate' },
      { name: 'Lymphatic filariasis', prevalence: '10M+ at risk Pacific', severity: 'moderate' }
    ],
    precautions: [
      'Malaria prophylaxis for PNG travel',
      'Standard hygiene in Australia',
      'Wear shoes in tropical regions',
      'Use insect repellent in Pacific Islands',
      'Drink bottled water in PNG',
      'Bed nets in malaria areas'
    ],
    countries: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Samoa', 'Vanuatu'],
    dataSource: 'WHO WPRO 2024, Australian DoH 2024'
  }
};

const riskLevels = {
  low: { label: 'Low Risk', color: '#22c55e', range: '0-25%' },
  moderate: { label: 'Moderate Risk', color: '#eab308', range: '25-50%' },
  high: { label: 'High Risk', color: '#f97316', range: '50-75%' },
  critical: { label: 'Critical Risk', color: '#dc2626', range: '75-100%' }
};

const TravelRiskMapPage = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [geographies, setGeographies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(geoUrl)
      .then(response => response.json())
      .then(topology => {
        const countries = topojson.feature(topology, topology.objects.countries);
        setGeographies(countries.features);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map:', err);
        setLoading(false);
      });
  }, []);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId);
  };

  const getRegionFromCountryId = (id) => {
    const code = countryIdToCode[id];
    return code ? countryToRegion[code] : null;
  };

  const getCountryColor = (id) => {
    const region = getRegionFromCountryId(id);
    if (region && regionData[region]) {
      return regionData[region].color;
    }
    return '#94a3b8';
  };

  const getCountryOpacity = (id) => {
    const region = getRegionFromCountryId(id);
    if (region === selectedRegion || region === hoveredRegion) {
      return 1;
    }
    if (region && regionData[region]) {
      return 0.8;
    }
    return 0.5;
  };

  const projectPoint = (lon, lat) => {
    const x = (lon + 180) * (900 / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (450 / 2) - (900 * mercN / (2 * Math.PI));
    return [x, Math.max(0, Math.min(450, y))];
  };

  const pathGenerator = (geometry) => {
    if (!geometry) return '';
    
    const processCoordinates = (coords) => {
      return coords.map(ring => {
        const points = ring.map(([lon, lat]) => projectPoint(lon, lat));
        return 'M' + points.map(p => p.join(',')).join('L') + 'Z';
      }).join('');
    };

    if (geometry.type === 'Polygon') {
      return processCoordinates(geometry.coordinates);
    } else if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.map(polygon => processCoordinates(polygon)).join('');
    }
    return '';
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <SEO 
        title="Travel Risk Map - Parasite Identification Pro"
        description="Interactive world map showing parasite risk levels by region with real WHO/CDC data and travel health advisories."
      />
      <Navbar />
      
      <div className="travel-map-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>Global Parasite Risk Heat Map</h1>
          <p className="subtitle">Interactive visualization based on WHO/CDC 2024 data</p>
          <p className="instruction">Tap any country to view detailed parasite data and travel precautions</p>
        </div>
      </div>

      <div className="travel-map-container">
        
        <div className="travel-map-legend">
          <div className="travel-map-legend-title">HEAT MAP LEGEND</div>
          {Object.entries(riskLevels).map(([key, level]) => (
            <div key={key} className="travel-map-legend-item">
              <div className="travel-map-legend-color" style={{ backgroundColor: level.color }} />
              <span className="travel-map-legend-label">{level.label}</span>
              <span className="travel-map-legend-range">({level.range})</span>
            </div>
          ))}
        </div>

        <div className="travel-map-svg-container">
          {loading ? (
            <div style={{ 
              height: '250px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.95rem'
            }}>
              Loading world map...
            </div>
          ) : (
            <svg
              viewBox="0 0 900 450"
              style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'manipulation' }}
              preserveAspectRatio="xMidYMid meet"
            >
              <rect x="0" y="0" width="900" height="450" fill="#1a4971" />
              
              {geographies.map((geo, i) => {
                const region = getRegionFromCountryId(geo.id);
                return (
                  <path
                    key={`country-${geo.id}-${i}`}
                    d={pathGenerator(geo.geometry)}
                    fill={getCountryColor(geo.id)}
                    fillOpacity={getCountryOpacity(geo.id)}
                    stroke={region === selectedRegion ? '#fff' : '#1e3a5f'}
                    strokeWidth={region === selectedRegion ? 1.5 : 0.3}
                    style={{ 
                      cursor: region ? 'pointer' : 'default',
                      transition: 'fill-opacity 0.2s ease'
                    }}
                    onClick={() => region && handleRegionClick(region)}
                    onTouchEnd={(e) => {
                      if (region) {
                        e.preventDefault();
                        handleRegionClick(region);
                      }
                    }}
                    onMouseEnter={() => region && setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                );
              })}
              
              <text x="15" y="440" fill="rgba(255,255,255,0.4)" fontSize="9" fontStyle="italic">
                Data: WHO/CDC 2024 | Natural Earth
              </text>
            </svg>
          )}
        </div>

        <div className="travel-map-region-buttons">
          {Object.entries(regionData).map(([id, region]) => (
            <button
              key={id}
              onClick={() => handleRegionClick(id)}
              className="travel-map-region-btn"
              style={{
                backgroundColor: selectedRegion === id ? region.color : 'white',
                color: selectedRegion === id ? 'white' : '#374151',
                border: `2px solid ${region.color}`,
                boxShadow: selectedRegion === id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div className="travel-map-region-btn-name">{region.name}</div>
              <div className="travel-map-region-btn-risk" style={{ opacity: selectedRegion === id ? 0.9 : 0.7 }}>
                {riskLevels[region.riskLevel].label} ({region.riskScore}%)
              </div>
            </button>
          ))}
        </div>

        {selectedRegion && regionData[selectedRegion] && (
          <div 
            className="card travel-map-detail-card" 
            style={{ borderLeft: `4px solid ${regionData[selectedRegion].color}` }}
          >
            <div className="travel-map-detail-header">
              <div>
                <h2 className="travel-map-detail-title">{regionData[selectedRegion].name}</h2>
                <div className="travel-map-detail-badges">
                  <span 
                    className="travel-map-detail-badge" 
                    style={{ backgroundColor: regionData[selectedRegion].color }}
                  >
                    {riskLevels[regionData[selectedRegion].riskLevel].label}
                  </span>
                  <span 
                    className="travel-map-detail-score" 
                    style={{ color: regionData[selectedRegion].color }}
                  >
                    Risk: {regionData[selectedRegion].riskScore}%
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedRegion(null)} className="travel-map-close-btn">×</button>
            </div>

            <div className="travel-map-stats-grid">
              <div className="travel-map-stat">
                <div className="travel-map-stat-label">MALARIA</div>
                <div className="travel-map-stat-value">{regionData[selectedRegion].statistics.malariaPrevalence}</div>
              </div>
              <div className="travel-map-stat">
                <div className="travel-map-stat-label">CASES/YEAR</div>
                <div className="travel-map-stat-value">{regionData[selectedRegion].statistics.malariaCases}</div>
              </div>
              <div className="travel-map-stat">
                <div className="travel-map-stat-label">STH PREVALENCE</div>
                <div className="travel-map-stat-value">{regionData[selectedRegion].statistics.sthPrevalence}</div>
              </div>
              <div className="travel-map-stat">
                <div className="travel-map-stat-label">AT RISK</div>
                <div className="travel-map-stat-value">{regionData[selectedRegion].statistics.affectedPopulation}</div>
              </div>
            </div>

            <div className="travel-map-content-grid">
              <div>
                <h3 className="travel-map-section-title">Endemic Parasites (WHO/CDC Data)</h3>
                {regionData[selectedRegion].parasites.map((parasite, idx) => (
                  <div 
                    key={idx} 
                    className="travel-map-parasite-item"
                    style={{
                      backgroundColor: parasite.severity === 'critical' ? '#fef2f2' : 
                                       parasite.severity === 'high' ? '#fff7ed' : '#f0fdf4',
                      borderLeft: `3px solid ${parasite.severity === 'critical' ? '#dc2626' : 
                                               parasite.severity === 'high' ? '#f97316' : '#22c55e'}`
                    }}
                  >
                    <div className="travel-map-parasite-name">{parasite.name}</div>
                    <div className="travel-map-parasite-prevalence">{parasite.prevalence}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="travel-map-section-title">Recommended Precautions</h3>
                {regionData[selectedRegion].precautions.map((precaution, idx) => (
                  <div key={idx} className="travel-map-precaution-item">
                    <span className="travel-map-precaution-check">✓</span>
                    <span className="travel-map-precaution-text">{precaution}</span>
                  </div>
                ))}

                <div className="travel-map-countries-section">
                  <h4 className="travel-map-countries-title">Countries in this region:</h4>
                  <div className="travel-map-countries-list">
                    {regionData[selectedRegion].countries.map((country, idx) => (
                      <span key={idx} className="travel-map-country-tag">{country}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {regionData[selectedRegion].dataSource && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                color: '#0369a1'
              }}>
                <strong>Data Source:</strong> {regionData[selectedRegion].dataSource}
              </div>
            )}

            <div className="travel-map-disclaimer">
              <strong>Medical Disclaimer:</strong> This map provides general guidance based on WHO/CDC 2024 epidemiological data. Individual risk varies based on specific travel destinations, activities, duration, and personal health. Always consult with a travel medicine specialist before traveling.
            </div>
          </div>
        )}

        {!selectedRegion && (
          <div className="card travel-map-empty-state">
            <h3 className="travel-map-empty-title">Select a Region to Explore</h3>
            <p className="travel-map-empty-text">
              Tap any country on the map or use the buttons above to view detailed WHO/CDC parasite data and travel health recommendations.
            </p>
          </div>
        )}

        <div className="card travel-map-global-stats">
          <h3 className="travel-map-global-stats-title">Global Parasite Statistics (WHO 2024)</h3>
          <div className="travel-map-global-stats-grid">
            <div className="travel-map-global-stat-card" style={{ backgroundColor: '#fef2f2' }}>
              <div className="travel-map-global-stat-value" style={{ color: '#dc2626' }}>282M</div>
              <div className="travel-map-global-stat-label">Malaria Cases/Year</div>
              <div className="travel-map-global-stat-sublabel">610,000 deaths annually</div>
            </div>
            <div className="travel-map-global-stat-card" style={{ backgroundColor: '#fff7ed' }}>
              <div className="travel-map-global-stat-value" style={{ color: '#f97316' }}>1.5B</div>
              <div className="travel-map-global-stat-label">STH At Risk</div>
              <div className="travel-map-global-stat-sublabel">People at risk globally</div>
            </div>
            <div className="travel-map-global-stat-card" style={{ backgroundColor: '#fef9c3' }}>
              <div className="travel-map-global-stat-value" style={{ color: '#ca8a04' }}>200M</div>
              <div className="travel-map-global-stat-label">Schistosomiasis</div>
              <div className="travel-map-global-stat-sublabel">People infected worldwide</div>
            </div>
            <div className="travel-map-global-stat-card" style={{ backgroundColor: '#f0fdf4' }}>
              <div className="travel-map-global-stat-value" style={{ color: '#16a34a' }}>600M</div>
              <div className="travel-map-global-stat-label">Strongyloides</div>
              <div className="travel-map-global-stat-sublabel">Estimated infections</div>
            </div>
          </div>
        </div>

        <div className="travel-map-sources">
          <strong>Data Sources:</strong> World Health Organization (WHO) World Malaria Report 2024, CDC Division of Parasitic Diseases, 
          Global Burden of Disease Study 2021, WHO Soil-transmitted Helminths Fact Sheet 2024
        </div>
      </div>
    </div>
  );
};

export default TravelRiskMapPage;
