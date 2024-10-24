const questions = [
  {
    question: "What does the acronym CPU stand for?",
    options: ["Central Processing Unit", "Computer Power Unit", "Central Performance Unit", "Core Processing Unit", "Central Program Unit"],
    answer: "Central Processing Unit",
    image: require('../assets/processors.jpg'),
  },
  {
    question: "Which type of RAM is most commonly used in modern computers?",
    options: ["Static Random Access Memory (SRAM)", "Dynamic Random Access Memory (DRAM)", "Synchronous Dynamic Random Access Memory (SDRAM)", "Double Data Rate Synchronous Dynamic Random Access Memory (DDR)", "Ferroelectric Random Access Memory (FRAM)"],
    answer: "Double Data Rate Synchronous Dynamic Random Access Memory (DDR)",
    image: require('../assets/Random_access_memory.jpg'),
  },
  {
    question: "What is the primary function of a Power Supply Unit (PSU)?",
    options: ["To store data", "To cool components", "To convert Alternating Current (AC) to Direct Current (DC) power", "To manage data transfer", "To process graphics"],
    answer: "To convert Alternating Current (AC) to Direct Current (DC) power",
    image: require('../assets/Powersupply.webp'),
  },
  {
    question: "Which storage technology is known for its high speed and durability?",
    options: ["Hard Disk Drive (HDD)", "Solid-State Drive (SSD)", "Compact Disc Read-Only Memory (CD-ROM)", "Floppy Disk", "Tape Drive"],
    answer: "Solid-State Drive (SSD)",
    image: require('../assets/assortred-digital-storage-devices-isolated-on-white-background-EA5E9W-transformed.jpeg'),
  },
  {
    question: "What is the primary benefit of using a Solid-State Drive (SSD) over a Hard Disk Drive (HDD)?",
    options: ["Lower cost", "Larger capacity", "Faster data access speeds", "More moving parts", "Easier to repair"],
    answer: "Faster data access speeds",
    image: require('../assets/ssdvshdd.jpg'),
  },
  {
    question: "Which component is responsible for rendering images in a gaming PC?",
    options: ["Central Processing Unit (CPU)", "Graphics Processing Unit (GPU)", "Random Access Memory (RAM)", "Motherboard", "Solid-State Drive (SSD)"],
    answer: "Graphics Processing Unit (GPU)",
    image: require('../assets/img.jpg'),
  },
  {
    question: "What does the term 'overclocking' refer to?",
    options: ["Reducing the power supply", "Increasing the clock speed of a component", "Cooling down the system", "Increasing storage capacity", "Updating drivers"],
    answer: "Increasing the clock speed of a component",
    image: require('../assets/overclocking.jpg'),
  },
  {
    question: "What is Redundant Array of Independent Disks (RAID) primarily used for?",
    options: ["Enhancing graphics", "Increasing storage capacity", "Data redundancy and performance improvement", "Cooling components", "Power management"],
    answer: "Data redundancy and performance improvement",
    image: require('../assets/raid.jpg'),
  },
  {
    question: "Which type of motherboard slot is used for graphics cards?",
    options: ["Peripheral Component Interconnect (PCI)", "Accelerated Graphics Port (AGP)", "Peripheral Component Interconnect Express (PCIe)", "Serial ATA (SATA)", "Dual Inline Memory Module (DIMM)"],
    answer: "Peripheral Component Interconnect Express (PCIe)",
    image: require('../assets/slots.jpg'),
  },
  {
    question: "What does a heat sink do?",
    options: ["Increases power output", "Transfers data", "Dissipates heat from components", "Stores information", "Increases RAM capacity"],
    answer: "Dissipates heat from components",
    image: require('../assets/heat-sink.jpg'),
  },
  {
    question: "Which of the following is a feature of modern Graphics Processing Units (GPUs)?",
    options: ["High power consumption only", "Integrated cooling solutions", "No ability to process graphics", "Lack of memory", "Exclusive use for gaming"],
    answer: "Integrated cooling solutions",
    image: require('../assets/gcas-398_gcas_398_02.jpg'),
  },
  {
    question: "What technology allows for faster data transfer in Solid-State Drives (SSDs) compared to traditional Hard Disk Drives (HDDs)?",
    options: ["Serial ATA (SATA)", "Non-Volatile Memory Express (NVMe)", "Integrated Drive Electronics (IDE)", "Small Computer System Interface (SCSI)", "Universal Serial Bus (USB)"],
    answer: "Non-Volatile Memory Express (NVMe)",
    image: require('../assets/sata-nvme.png'),
  },
];

export default questions;