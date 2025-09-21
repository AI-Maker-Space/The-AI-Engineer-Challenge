#!/usr/bin/env python3
"""
Grade 3 Science PDF Generator
Creates 10 educational PDFs for kids with ~90 lines of content each.

Usage: uv run python scripts/generate_pdfs.py

Sources:
- NASA Kids: https://www.nasa.gov/audience/forkids/
- National Geographic Kids: https://kids.nationalgeographic.com/
- Smithsonian National Museum of Natural History: https://naturalhistory.si.edu/education/kids
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
import os
from datetime import datetime

def create_styles():
    """Create custom styles for kid-friendly PDFs"""
    styles = getSampleStyleSheet()
    
    # Title style
    title_style = ParagraphStyle(
        'KidTitle',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=20,
        textColor=HexColor('#2E86AB'),
        alignment=1  # Center
    )
    
    # Content style for kids
    content_style = ParagraphStyle(
        'KidContent',
        parent=styles['Normal'],
        fontSize=13,
        spaceAfter=10,
        leading=18,
        textColor=HexColor('#333333')
    )
    
    return title_style, content_style

def get_pdf_content():
    """
    Returns content for all 10 Grade 3 science PDFs
    Each entry contains: filename, title, content (list of paragraphs)
    Content is sourced from reputable educational sources
    """
    
    current_date = datetime.now().strftime("%b_%Y")
    
    return [
        {
            "filename": f"Easy_Planets_Saturn_Grade3_{current_date}.pdf",
            "title": "Amazing Saturn - The Planet with Beautiful Rings",
            "content": [
                "Saturn is one of the most beautiful planets in our solar system. It is the sixth planet from the Sun and is famous for its stunning rings that circle around it like a hula hoop!",
                
                "Saturn is a giant planet made mostly of gas, just like Jupiter. It is so big that you could fit about 764 Earths inside it! Even though it's huge, Saturn is actually lighter than water. If you could find a bathtub big enough, Saturn would float!",
                
                "The most amazing thing about Saturn is its rings. These rings are made of billions of pieces of ice and rock. Some pieces are as small as snowballs, while others are as big as houses! The rings stretch out for thousands of miles but are very thin.",
                
                "Saturn has many moons - at least 83 of them! The biggest moon is called Titan, and it's even bigger than the planet Mercury. Titan has thick clouds and lakes, but instead of water, these lakes are filled with liquid methane.",
                
                "Another interesting moon is Enceladus, which shoots giant water geysers into space from its south pole. Scientists think there might be an ocean under its icy surface where tiny sea creatures could live!",
                
                "Saturn takes about 29 Earth years to travel around the Sun once. That means if you were born on Saturn, you would only have a birthday every 29 years! But Saturn spins very fast - one day on Saturn is only about 10 hours long.",
                
                "The planet is named after the Roman god of farming and harvest. Ancient people could see Saturn in the night sky, but they couldn't see its rings without telescopes. When Galileo first looked at Saturn through his telescope in 1610, he thought the rings looked like handles!",
                
                "Saturn is made mostly of hydrogen and helium gases. The planet has strong winds that can blow at speeds of up to 1,100 miles per hour! These winds create beautiful bands of clouds in different colors - yellow, gold, and brown.",
                
                "If you could visit Saturn, you would see an amazing sight. The rings would look like a giant bridge stretching across the sky. The Sun would look much smaller and dimmer than it does from Earth because Saturn is so far away.",
                
                "Scientists study Saturn using spacecraft. The Cassini spacecraft spent 13 years flying around Saturn and taking thousands of pictures. It discovered new moons, studied the rings up close, and even landed a small probe on Titan!",
                
                "Saturn's rings are not solid like a CD. They are made of countless small particles all orbiting around the planet. Sometimes these particles bump into each other and create beautiful patterns in the rings.",
                
                "The temperature on Saturn is very cold - about minus 288 degrees Fahrenheit! That's much colder than the coldest place on Earth. The planet gets very little heat from the Sun because it's so far away.",
                
                "One of Saturn's moons, Iapetus, is very strange. One side is bright white like snow, and the other side is dark black like charcoal. Scientists think this happened because dark material from space landed on one side of the moon.",
                
                "Saturn's largest moon, Titan, has weather just like Earth! It has clouds, rain, rivers, and lakes. But instead of water, everything is made of methane and ethane, which are gases on Earth but liquids on cold Titan.",
                
                "The rings of Saturn are not permanent. Scientists think they might disappear in about 100 million years as the ice and rock particles slowly fall into the planet. But don't worry - that's a very, very long time from now!",
                
                "Saturn is a wonderful example of how amazing and diverse our solar system is. Every planet is unique and special in its own way, and Saturn shows us that space is full of incredible sights and mysteries waiting to be discovered!"
            ]
        },
        
        {
            "filename": f"Easy_Constellations_Autumn_Grade3_{current_date}.pdf",
            "title": "Autumn Constellations - Star Pictures in the Night Sky",
            "content": [
                "When autumn arrives, the night sky becomes a magical place filled with star patterns called constellations. These star pictures have been helping people for thousands of years to tell stories, navigate, and understand the seasons.",
                
                "A constellation is a group of stars that forms a pattern or picture when you connect them with imaginary lines. Ancient people looked up at the stars and saw animals, heroes, and mythical creatures in these patterns.",
                
                "In autumn, one of the most famous constellations you can see is called the Great Square of Pegasus. Pegasus was a magical flying horse in Greek stories. The Great Square forms the body of this flying horse, and you can see it high in the southern sky.",
                
                "Connected to Pegasus is the constellation Andromeda, named after a princess in ancient stories. Andromeda contains something very special - the Andromeda Galaxy! This galaxy is so far away that its light takes 2.5 million years to reach us.",
                
                "Another beautiful autumn constellation is Cassiopeia, which looks like the letter 'W' or 'M' depending on how you look at it. Cassiopeia was a vain queen in Greek mythology who boasted that she was more beautiful than the sea nymphs.",
                
                "The constellation Perseus can also be seen in autumn skies. Perseus was a brave hero who saved Princess Andromeda from a sea monster. In the night sky, Perseus appears to be holding the head of Medusa, a monster with snakes for hair.",
                
                "Cygnus, the Swan, is another autumn constellation that looks like a large bird flying across the sky. The brightest star in Cygnus is called Deneb, which means 'tail' in Arabic because it marks the tail of the swan.",
                
                "The constellation Aquarius, the Water Bearer, becomes visible in autumn. Ancient people saw this as a man pouring water from a jug. The 'water' appears to flow down toward the southern horizon in a stream of faint stars.",
                
                "One of the most interesting things about autumn constellations is that they're different from the ones you see in summer or winter. This happens because Earth travels around the Sun, so our nighttime view of space changes throughout the year.",
                
                "The stars in constellations aren't actually close to each other in space. Some stars might be very close to Earth while others in the same constellation are incredibly far away. They just happen to line up when we look at them from Earth.",
                
                "Many autumn constellations have bright stars that are easy to find. The star Fomalhaut in the constellation Piscis Austrinus is sometimes called the 'loneliest star' because it appears all by itself in a dark part of the autumn sky.",
                
                "Native American tribes had their own stories about autumn constellations. They saw different pictures in the same star patterns. For example, what we call the Great Square of Pegasus, some tribes saw as a large lodge or dwelling place.",
                
                "The best time to see autumn constellations is on a clear, dark night away from city lights. You don't need a telescope - just your eyes! It's fun to lie on a blanket and try to trace the star patterns with your finger.",
                
                "Autumn constellations can help you find directions. The constellation Cassiopeia always points toward Polaris, the North Star. This makes it a useful constellation for navigation, just like ancient sailors used it to find their way across the oceans.",
                
                "Some autumn constellations contain star clusters - groups of stars that were born together and travel through space as a family. The constellation Perseus contains the famous Double Cluster, which looks like two fuzzy patches of light.",
                
                "Learning about autumn constellations connects us to people throughout history. When you look up at the same stars that ancient Greeks, Native Americans, and explorers saw, you're sharing an experience that spans thousands of years and brings us all together under the same beautiful night sky."
            ]
        },
        
        {
            "filename": f"Easy_Rocks_Minerals_Grade3_{current_date}.pdf",
            "title": "Rocks and Minerals - The Building Blocks of Earth",
            "content": [
                "Rocks and minerals are everywhere around us! They make up the ground we walk on, the mountains we see, and even the buildings we live in. Every rock has an amazing story about how our Earth was formed.",
                
                "A mineral is a natural substance that forms in the Earth. Think of minerals as the ingredients that make up rocks, just like flour, sugar, and eggs are ingredients that make up a cake. Common minerals include quartz, feldspar, and mica.",
                
                "There are three main types of rocks: igneous, sedimentary, and metamorphic. Each type forms in a different way, and understanding how they form helps us learn about Earth's history and the forces that shape our planet.",
                
                "Igneous rocks form when melted rock, called magma, cools and hardens. When magma cools slowly underground, it forms rocks with large crystals like granite. When lava cools quickly on Earth's surface, it forms rocks with small crystals like basalt.",
                
                "Sedimentary rocks form when tiny pieces of other rocks, sand, and dead plants and animals get pressed together over millions of years. Sandstone forms from sand, limestone forms from ancient sea creatures, and coal forms from old plants.",
                
                "Metamorphic rocks form when existing rocks get squeezed and heated deep inside the Earth, but don't melt completely. The heat and pressure change the rock into something new. Marble forms from limestone, and slate forms from shale.",
                
                "The rock cycle shows how rocks can change from one type to another over very long periods of time. An igneous rock can become sedimentary, then metamorphic, then igneous again! This cycle has been happening for billions of years.",
                
                "Minerals have special properties that help us identify them. Hardness tells us how easily a mineral can be scratched. Diamond is the hardest mineral, while talc is so soft you can scratch it with your fingernail.",
                
                "Color is another property of minerals, but it can be tricky! The same mineral can come in different colors. Quartz can be clear, purple (amethyst), yellow (citrine), or pink (rose quartz). The color depends on tiny amounts of other elements mixed in.",
                
                "Luster describes how shiny a mineral looks. Some minerals have a metallic luster like gold or silver. Others have a glassy luster like quartz, or a pearly luster like the inside of a seashell.",
                
                "Crystals are minerals that have grown in perfect geometric shapes. Salt, sugar, and snowflakes are all crystals! The shape of a crystal depends on how the atoms inside are arranged, like a tiny invisible blueprint.",
                
                "Many rocks contain fossils, which are the remains of ancient plants and animals that lived millions of years ago. Fossils help scientists learn about what Earth was like long before humans existed.",
                
                "Rocks and minerals are very useful to people. We use granite for kitchen counters, marble for statues, and sand for making glass. Metals like iron, copper, and gold come from minerals that we mine from the Earth.",
                
                "Gemstones are minerals that are especially beautiful and rare. Diamonds, rubies, emeralds, and sapphires are all gemstones. People have treasured these beautiful minerals for thousands of years and use them to make jewelry.",
                
                "You can find interesting rocks and minerals almost anywhere! Look for different colors, textures, and shapes. Always ask permission before collecting rocks, and never take rocks from national parks or private property.",
                
                "Studying rocks and minerals helps us understand how Earth works. Geologists are scientists who study rocks to learn about earthquakes, volcanoes, and how mountains form. They're like detectives solving mysteries about our planet's past and future!"
            ]
        },
        
        {
            "filename": f"Easy_Water_Cycle_Grade3_{current_date}.pdf",
            "title": "The Amazing Water Cycle - How Water Travels Around Earth",
            "content": [
                "The water cycle is like a giant recycling system that moves water all around our planet. The same water that falls as rain today might have been in the ocean last week, in a cloud yesterday, and could be in a river tomorrow!",
                
                "The water cycle has four main steps: evaporation, condensation, precipitation, and collection. These steps happen over and over again, moving water from the oceans to the sky, then back to the land and oceans.",
                
                "Evaporation happens when the Sun heats up water in oceans, rivers, and lakes. The heat turns the liquid water into invisible water vapor that rises up into the air. It's like when you see steam coming from a hot cup of cocoa!",
                
                "Plants also help with evaporation through a process called transpiration. Plants drink water through their roots and then release water vapor through tiny holes in their leaves. A large tree can release hundreds of gallons of water into the air each day!",
                
                "As water vapor rises high into the sky, it gets colder. When it gets cold enough, the water vapor turns back into tiny water droplets. This process is called condensation, and it's how clouds form in the sky.",
                
                "Clouds are made of billions of tiny water droplets floating in the air. These droplets are so small and light that they can float, just like how dust particles float in a sunbeam. Different types of clouds form at different heights in the sky.",
                
                "When the water droplets in clouds get bigger and heavier, they fall back to Earth as precipitation. Precipitation can be rain, snow, sleet, or hail, depending on how cold it is in the atmosphere.",
                
                "Rain happens when water droplets in clouds bump into each other and stick together until they become heavy enough to fall. A single raindrop contains millions of the tiny droplets that were floating in the cloud!",
                
                "Snow forms when water vapor freezes directly into ice crystals in very cold clouds. Each snowflake has a unique, beautiful pattern. No two snowflakes are exactly alike, even though billions and billions have fallen throughout history!",
                
                "After precipitation falls to Earth, it collects in different places. Some rain soaks into the ground and becomes groundwater. Some flows into streams and rivers that carry it back to the ocean. Some falls directly into lakes and ponds.",
                
                "Groundwater is water that soaks into the soil and rocks underground. This water can stay underground for a very long time, slowly moving through tiny spaces in rocks and soil. Wells are dug to bring this groundwater up for people to use.",
                
                "Rivers and streams carry water from high places like mountains down to lower places like valleys and eventually to the ocean. Along the way, this flowing water carves valleys, moves rocks and soil, and provides homes for fish and other animals.",
                
                "The water cycle is powered by energy from the Sun. Without the Sun's heat, water wouldn't evaporate, clouds wouldn't form, and rain wouldn't fall. The Sun is like the engine that keeps the water cycle running all the time.",
                
                "The water cycle helps keep Earth's temperature comfortable for living things. When water evaporates, it takes heat energy with it, which helps cool the surface. When water vapor condenses into clouds, it releases that heat energy back into the atmosphere.",
                
                "All living things depend on the water cycle. Plants need water to grow, animals need water to drink, and people use water for drinking, cooking, cleaning, and many other activities. Without the water cycle, life on Earth would not be possible.",
                
                "The water cycle has been happening for billions of years, long before there were any people on Earth. The water you drink today might have once been part of a dinosaur, fallen as rain in ancient forests, or flowed in rivers that no longer exist. Water truly connects all life on our amazing planet!"
            ]
        },
        
        {
            "filename": f"Easy_Volcanoes_Grade3_{current_date}.pdf",
            "title": "Volcanoes - Earth's Amazing Fire Mountains",
            "content": [
                "Volcanoes are like Earth's safety valves! Deep inside our planet, it's so hot that rocks melt into a liquid called magma. When this hot magma finds a way to the surface, it creates a volcano.",
                
                "A volcano is basically a mountain or hill with a special opening that connects to the hot, melted rock deep inside Earth. When pressure builds up underground, the magma can shoot up through this opening in an eruption.",
                
                "There are about 1,500 active volcanoes around the world today. That means they could erupt at any time! But don't worry - scientists carefully watch these volcanoes and can usually warn people before an eruption happens.",
                
                "When magma comes out of a volcano, we call it lava. Lava is incredibly hot - about 2,000 degrees Fahrenheit! That's hot enough to melt copper pennies. Lava glows bright orange and red because it's so hot.",
                
                "There are different types of volcanic eruptions. Some are gentle and slow, with lava flowing like thick honey down the sides of the volcano. Others are explosive, shooting lava, rocks, and ash high into the sky like a giant fireworks show.",
                
                "Volcanic ash is not like the ash from a campfire. It's actually tiny pieces of volcanic glass and rock that are shot into the air during an eruption. This ash can travel hundreds of miles and make the sky dark, even during the day.",
                
                "The 'Ring of Fire' is a area around the Pacific Ocean where many volcanoes and earthquakes happen. This ring includes volcanoes in Japan, Indonesia, the Philippines, Alaska, and the western coasts of North and South America.",
                
                "Hawaii has some of the most famous volcanoes in the world. The Hawaiian volcanoes are special because they create new land! As lava flows into the ocean and cools, it hardens into new rock, making the Hawaiian islands bigger over time.",
                
                "Mount Vesuvius in Italy is one of the most famous volcanoes in history. In 79 AD, it erupted and buried the city of Pompeii in ash. Today, scientists study Pompeii to learn about how people lived in ancient Roman times.",
                
                "Not all volcanoes are dangerous to people. Many volcanoes are far from cities and towns. Some haven't erupted for thousands of years and may never erupt again. These are called dormant or extinct volcanoes.",
                
                "Volcanoes can create beautiful things! Volcanic soil is very rich and good for growing crops. Many islands, like Hawaii and Iceland, were created entirely by volcanoes. Hot springs and geysers often form near volcanoes too.",
                
                "The biggest volcano in our solar system isn't on Earth - it's on Mars! Olympus Mons on Mars is three times taller than Mount Everest. But don't worry, it's been extinct for millions of years.",
                
                "Scientists who study volcanoes are called volcanologists. They use special tools to measure earthquakes, gas emissions, and temperature changes that might signal an upcoming eruption. Some even wear special heat-resistant suits to get close to active lava!",
                
                "Volcanic eruptions can affect weather around the world. When volcanoes shoot ash and gases high into the atmosphere, they can block sunlight and make temperatures cooler for months or even years.",
                
                "Many animals and plants have learned to live near volcanoes. Some bacteria can actually live in the hot water around volcanic vents on the ocean floor. These amazing creatures show us how life can adapt to extreme conditions.",
                
                "Volcanoes remind us that Earth is a living, changing planet. While they can be dangerous, volcanoes also play an important role in creating new land, enriching soil, and helping us understand how our planet works. They're truly one of nature's most powerful and amazing forces!"
            ]
        },
        
        {
            "filename": f"Easy_Earthquakes_Grade3_{current_date}.pdf",
            "title": "Earthquakes - When the Earth Shakes and Moves",
            "content": [
                "An earthquake happens when the ground suddenly shakes and moves. This shaking occurs because huge pieces of Earth's outer layer, called tectonic plates, are slowly moving and sometimes get stuck against each other.",
                
                "Think of Earth's outer layer like a cracked eggshell made up of many large pieces. These pieces, or plates, are always moving very slowly - about as fast as your fingernails grow. Most of the time we can't feel this movement.",
                
                "Sometimes these moving plates get stuck against each other, like when you try to slide two pieces of sandpaper together. Pressure builds up until suddenly the plates slip and move quickly. This sudden movement causes an earthquake.",
                
                "The place underground where an earthquake starts is called the focus or hypocenter. The place on the surface directly above the focus is called the epicenter. The epicenter is usually where the shaking is strongest.",
                
                "Scientists measure how strong earthquakes are using something called the Richter scale. Small earthquakes that you can barely feel might be a 2 or 3. Very strong earthquakes that can damage buildings might be a 7, 8, or 9.",
                
                "Most earthquakes happen along the edges of tectonic plates. That's why places like California, Japan, and Chile have more earthquakes than other places. These areas sit right on the boundaries between different plates.",
                
                "The San Andreas Fault in California is one of the most famous earthquake zones in the world. A fault is like a crack in the Earth where two plates meet. You can actually see parts of the San Andreas Fault from an airplane!",
                
                "Earthquakes create different types of waves that travel through the Earth. P-waves (primary waves) are fast and arrive first. S-waves (secondary waves) are slower but stronger. Surface waves travel along the ground and cause most of the damage we see.",
                
                "Animals sometimes act strangely before earthquakes. Dogs might bark more, horses might get nervous, and some animals might try to hide. Scientists aren't sure exactly why this happens, but animals might feel the tiny movements that come before bigger shakes.",
                
                "Most earthquakes last less than a minute, and many last only a few seconds. But even a short earthquake can seem very long when you're experiencing it! The shaking might feel like being on a boat in rough water.",
                
                "After a big earthquake, there are usually smaller earthquakes called aftershocks. These happen as the Earth settles into its new position. Aftershocks can continue for days, weeks, or even months after the main earthquake.",
                
                "Scientists called seismologists study earthquakes using special instruments called seismographs. These machines can detect earthquakes from thousands of miles away and help scientists learn when and where earthquakes might happen.",
                
                "Not all earthquakes are dangerous. Millions of small earthquakes happen every year that are so tiny people don't even feel them. Only the biggest earthquakes cause damage to buildings and can be dangerous to people.",
                
                "If you feel an earthquake, the safest thing to do is 'Drop, Cover, and Hold On.' Drop to your hands and knees, take cover under a strong table or desk, and hold on to it. Stay away from windows and things that might fall.",
                
                "Earthquakes can cause other natural events like landslides and tsunamis. A tsunami is a giant wave that can form when an earthquake happens under the ocean. The earthquake pushes the water up, creating huge waves that travel across the ocean.",
                
                "Even though earthquakes can be scary, they're a natural part of how our planet works. The same forces that cause earthquakes also help create mountains, valleys, and other beautiful features of our Earth. Understanding earthquakes helps us build safer buildings and communities, and reminds us that we live on an amazing, dynamic planet that's always changing!"
            ]
        },
        
        {
            "filename": f"Easy_Solar_Eclipse_Grade3_{current_date}.pdf",
            "title": "Solar Eclipse - When the Moon Blocks the Sun",
            "content": [
                "A solar eclipse is one of the most amazing sights in nature! It happens when the Moon moves between Earth and the Sun, blocking the Sun's light and casting a shadow on Earth. For a few minutes, day turns into night!",
                
                "Even though the Sun is much, much bigger than the Moon, they appear to be about the same size in our sky. This amazing coincidence happens because the Sun is also much farther away from Earth than the Moon is.",
                
                "There are three types of solar eclipses: total, partial, and annular. A total solar eclipse happens when the Moon completely covers the Sun. A partial eclipse happens when the Moon only covers part of the Sun. An annular eclipse happens when the Moon is a little farther from Earth and can't quite cover the whole Sun.",
                
                "During a total solar eclipse, you can see the Sun's corona - its beautiful, shimmering outer atmosphere that normally gets hidden by the Sun's bright light. The corona looks like silver flames dancing around the dark circle of the Moon.",
                
                "The shadow that the Moon casts on Earth during a solar eclipse has two parts. The umbra is the dark center where people see a total eclipse. The penumbra is the lighter outer shadow where people see a partial eclipse.",
                
                "A total solar eclipse can only be seen from a small area on Earth - usually only about 100 miles wide. As Earth rotates and the Moon moves, this shadow races across the planet at about 1,500 miles per hour!",
                
                "The longest a total solar eclipse can last is about 7 minutes and 30 seconds, but most last only 2 to 3 minutes. Even though it's short, people travel from all over the world to see this incredible natural event.",
                
                "During totality (when the Sun is completely blocked), the temperature can drop by 10 to 15 degrees Fahrenheit. Animals often get confused and act like nighttime is coming - birds might return to their nests and crickets might start chirping!",
                
                "You should never look directly at the Sun, even during an eclipse, without special eclipse glasses or filters. The Sun's light is so bright it can permanently damage your eyes. Regular sunglasses are not safe for looking at eclipses.",
                
                "Ancient people were often frightened by solar eclipses because they didn't understand what was happening. Some cultures thought a dragon was eating the Sun! They would bang pots and make loud noises to try to scare the dragon away.",
                
                "Solar eclipses helped scientists make important discoveries. In 1919, scientists used a solar eclipse to prove that Einstein's theory of relativity was correct by showing that the Sun's gravity bends starlight.",
                
                "The next total solar eclipse visible from the United States will happen on April 8, 2024. It will cross from Texas to Maine. After that, the next one won't happen until 2044! That's why people get so excited when an eclipse comes to their area.",
                
                "Solar eclipses happen somewhere on Earth about every 18 months, but any particular place on Earth might wait 300 to 400 years between total solar eclipses. This makes them very special and rare events for most people.",
                
                "You can make a simple eclipse viewer using a cardboard box, aluminum foil, and white paper. Poke a small hole in the foil and let sunlight shine through it onto the paper. This creates a safe image of the eclipse that you can watch.",
                
                "During a solar eclipse, you might see bright points of light around the edge of the Moon. These are called Baily's beads, named after the astronomer who first described them. They happen when sunlight shines through valleys on the Moon's surface.",
                
                "Solar eclipses remind us how perfectly our solar system works. The dance of the Earth, Moon, and Sun creates these spectacular shows that have amazed people for thousands of years. They connect us to the cosmos and show us that we're part of something much bigger and more wonderful than we can imagine!"
            ]
        },
        
        {
            "filename": f"Easy_Animal_Habitats_Grade3_{current_date}.pdf",
            "title": "Animal Habitats - Amazing Homes in Nature",
            "content": [
                "A habitat is like a home for animals - it's the place where they live, find food, get water, and raise their babies. Every animal has a special habitat that gives them everything they need to survive and be happy.",
                
                "Different animals need different types of habitats. A polar bear needs the cold, icy Arctic to survive, while a camel is perfectly suited for hot, dry deserts. Each animal has special features that help them live in their particular habitat.",
                
                "Forest habitats are home to many different animals. In deciduous forests where leaves change colors, you might find deer, squirrels, bears, and many types of birds. The trees provide food, shelter, and places to build nests.",
                
                "Tropical rainforests are the most diverse habitats on Earth! They're home to colorful parrots, playful monkeys, slow-moving sloths, and thousands of different insects. The warm, wet climate helps many different species live together.",
                
                "Ocean habitats are vast underwater worlds. From tiny seahorses hiding in coral reefs to giant blue whales swimming in deep waters, the ocean provides homes for countless sea creatures. Different ocean zones have different types of animals.",
                
                "Desert habitats might seem empty, but they're actually full of life! Camels, lizards, snakes, and many insects have special ways to survive with very little water. Some desert animals are active at night when it's cooler.",
                
                "Grassland habitats, like prairies and savannas, are home to grazing animals like zebras, bison, and antelope. These wide-open spaces with lots of grass provide perfect feeding grounds for animals that eat plants.",
                
                "Arctic habitats are cold and icy, but many animals thrive there. Polar bears have thick fur and fat to keep warm. Penguins huddle together for warmth. Arctic foxes change color from brown in summer to white in winter for camouflage.",
                
                "Wetland habitats like swamps and marshes are very important for many animals. Ducks, geese, frogs, and alligators all depend on these watery homes. Wetlands also help clean water and prevent flooding.",
                
                "Mountain habitats change as you go higher up. At the bottom, you might find deer and bears. Higher up, you might see mountain goats with special hooves for climbing rocky cliffs. The air gets thinner and colder as you go up.",
                
                "Some animals migrate, which means they travel from one habitat to another during different seasons. Monarch butterflies fly thousands of miles from Canada to Mexico. Many birds fly south for winter and north for summer.",
                
                "Animals have amazing adaptations that help them survive in their habitats. Giraffes have long necks to reach tall tree leaves. Fish have gills to breathe underwater. Bats have wings to fly and catch insects at night.",
                
                "Coral reef habitats are like underwater cities! These colorful reefs are home to clownfish, sea turtles, sharks, and thousands of other sea creatures. The coral itself is actually made of tiny living animals.",
                
                "Some animals can live in multiple habitats. Raccoons are very adaptable and can live in forests, cities, and suburban areas. They're good at finding food and shelter in many different places.",
                
                "Human activities can affect animal habitats. When forests are cut down or wetlands are drained, animals lose their homes. But people are also working to protect habitats by creating national parks and wildlife reserves.",
                
                "Every habitat is connected to other habitats in important ways. Rivers connect mountains to oceans. Animals that migrate connect different habitats across the world. Taking care of all habitats helps ensure that animals have safe homes for generations to come!"
            ]
        },
        
        {
            "filename": f"Easy_Simple_Machines_Grade3_{current_date}.pdf",
            "title": "Simple Machines - Tools That Make Work Easier",
            "content": [
                "Simple machines are basic tools that make work easier by helping us use force more effectively. Even though they're called 'simple,' these machines are the building blocks for all the complex machines we use today!",
                
                "There are six types of simple machines: the lever, wheel and axle, pulley, inclined plane, wedge, and screw. You probably use several of these every day without even thinking about it!",
                
                "A lever is like a seesaw - it's a bar that pivots on a point called a fulcrum. Levers help us lift heavy things with less effort. A crowbar, scissors, and even your arm are all examples of levers working to make tasks easier.",
                
                "The wheel and axle is one of the most important inventions in human history! A wheel is attached to a rod called an axle, and they turn together. This makes it much easier to move heavy things. Cars, bicycles, and shopping carts all use wheels and axles.",
                
                "A pulley is a wheel with a rope or chain around it. Pulleys help us lift heavy objects by changing the direction of the force we apply. Flag poles use pulleys to raise flags, and construction cranes use many pulleys to lift heavy building materials.",
                
                "An inclined plane is simply a slanted surface, like a ramp. It's much easier to push a heavy box up a ramp than to lift it straight up. Wheelchair ramps, slides, and even stairs are all examples of inclined planes.",
                
                "A wedge is like two inclined planes put together to make a sharp edge. Wedges are used to split things apart or cut through materials. Knives, axes, and even your teeth are wedges that help us cut and tear food.",
                
                "A screw is really an inclined plane wrapped around a cylinder. Screws hold things together and can also be used to lift objects. Jar lids, bolts, and spiral staircases all work like screws.",
                
                "Simple machines give us a 'mechanical advantage,' which means they multiply the force we put in. A small force applied to a simple machine can create a much larger force to do work. This is why a child can lift an adult on a seesaw!",
                
                "You can find simple machines everywhere in your daily life. A bottle opener is a lever, a doorknob is a wheel and axle, window blinds use pulleys, a slide is an inclined plane, a knife is a wedge, and a jar lid is a screw.",
                
                "Many tools combine different simple machines to work better. Scissors combine two levers and two wedges. A wheelbarrow uses a wheel and axle plus a lever. A hand drill combines a wheel and axle with a screw.",
                
                "Simple machines have been used by humans for thousands of years. Ancient Egyptians used inclined planes to build the pyramids, rolling huge stone blocks up ramps. The ancient Greeks understood how levers worked and used them in construction.",
                
                "Even our bodies use simple machines! Your arms and legs work like levers, with your joints as fulcrums. When you bite down on food, your jaw works like a lever, and your teeth work like wedges to cut the food.",
                
                "Simple machines don't create energy - they just help us use our energy more efficiently. They can make work easier by reducing the amount of force needed, but the total amount of work (force times distance) stays the same.",
                
                "Understanding simple machines helps us solve problems and build better tools. Engineers use these basic principles to design everything from playground equipment to space shuttles. Even video game characters often use simple machines!",
                
                "Simple machines show us that sometimes the best solutions are also the simplest ones. These six basic tools have helped humans build civilizations, create art, and explore the world. They remind us that with the right tools and understanding, we can accomplish amazing things!"
            ]
        },
        
        {
            "filename": f"Easy_Human_Body_Grade3_{current_date}.pdf",
            "title": "The Amazing Human Body - How We Work Inside and Out",
            "content": [
                "Your body is like an amazing machine made up of many different parts working together! Every second of every day, your body is doing thousands of jobs to keep you healthy, growing, and able to learn and play.",
                
                "Your skeleton is the frame that holds your body up and protects your important organs. You have 206 bones in your adult skeleton, but babies are born with about 300 bones! As you grow, some of these bones fuse together.",
                
                "Your muscles are what help you move. You have over 600 muscles in your body! Some muscles you control, like the ones that help you walk or throw a ball. Others work automatically, like your heart muscle that beats all the time.",
                
                "Your heart is about the size of your fist and works like a powerful pump. It beats about 100,000 times every day, pumping blood to every part of your body. Blood carries oxygen and nutrients that your cells need to stay alive and healthy.",
                
                "Your lungs help you breathe in oxygen from the air and breathe out carbon dioxide. When you breathe in, your lungs fill up like balloons. The oxygen goes into your blood, and your heart pumps it all around your body.",
                
                "Your brain is like the control center for your whole body. It tells your heart to beat, your lungs to breathe, and your muscles to move. It also helps you think, remember, learn new things, and feel emotions like happiness and excitement.",
                
                "Your digestive system breaks down the food you eat so your body can use it for energy and growth. Your stomach is like a mixing bowl that churns food with special juices. Your small intestine absorbs nutrients from food into your blood.",
                
                "Your skin is your body's largest organ! It protects you from germs, helps control your body temperature, and lets you feel things like hot, cold, soft, and rough. Your skin also helps make vitamin D when you're in the sunshine.",
                
                "Your five senses - sight, hearing, smell, taste, and touch - help you learn about the world around you. Your eyes see light and colors, your ears hear sounds, your nose smells scents, your tongue tastes flavors, and your skin feels textures.",
                
                "Your nervous system is like your body's electrical wiring. It carries messages between your brain and the rest of your body faster than you can blink! This is how you can quickly pull your hand away from something hot.",
                
                "Your immune system is like your body's army, protecting you from germs and sickness. White blood cells patrol your body looking for harmful bacteria and viruses. When you get a cut, special cells rush to help heal the wound.",
                
                "Your kidneys are like filters that clean waste out of your blood. They make urine, which is how your body gets rid of things it doesn't need. You have two kidneys, and they filter all your blood many times every day!",
                
                "Your body needs sleep to grow, repair itself, and organize memories. While you sleep, your body releases growth hormones, your brain processes what you learned during the day, and your immune system gets stronger.",
                
                "Exercise is important for keeping your body strong and healthy. When you run, jump, and play, you make your heart stronger, your muscles bigger, and your bones denser. Exercise also helps your brain work better and makes you feel happy!",
                
                "Eating healthy foods gives your body the nutrients it needs to grow and work properly. Different foods provide different nutrients - fruits and vegetables give you vitamins, dairy products give you calcium for strong bones, and proteins help build muscles.",
                
                "Your body is truly amazing and unique! No one else in the world has exactly the same fingerprints, voice, or DNA as you. Taking care of your body by eating well, exercising, getting enough sleep, and staying clean helps you stay healthy and strong so you can do all the things you love!"
            ]
        }
    ]

def create_pdf(pdf_info, output_dir):
    """Create a single PDF with the given information"""
    filename = pdf_info["filename"]
    title = pdf_info["title"]
    content = pdf_info["content"]
    
    # Create the full path
    filepath = os.path.join(output_dir, filename)
    
    # Create PDF document
    doc = SimpleDocTemplate(filepath, pagesize=letter, topMargin=0.5*inch)
    
    # Get styles
    title_style, content_style = create_styles()
    
    # Build the story
    story = []
    
    # Add title
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Add content paragraphs
    for i, paragraph in enumerate(content):
        story.append(Paragraph(paragraph, content_style))
        
        # Add page break after every 5-6 paragraphs for better formatting
        if (i + 1) % 6 == 0 and i < len(content) - 1:
            story.append(PageBreak())
    
    # Build the PDF
    doc.build(story)
    print(f"✅ Created: {filename}")

def create_metadata_info():
    """Create metadata information for the PDFs"""
    metadata = {
        "source_references": [
            "NASA Kids - https://www.nasa.gov/audience/forkids/",
            "National Geographic Kids - https://kids.nationalgeographic.com/",
            "Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids"
        ],
        "model_used": "Claude 3.5 Sonnet (Anthropic)",
        "grade_level": "Grade 3 (Ages 8-9)",
        "content_approach": "Age-appropriate scientific facts with engaging storytelling",
        "creation_date": datetime.now().strftime("%Y-%m-%d"),
        "total_pdfs": 10,
        "average_content_length": "~90 lines per PDF (16 paragraphs)"
    }
    
    return metadata

def main():
    """Main function to generate all PDFs"""
    print("🚀 Starting Grade 3 Science PDF Generation...")
    
    # Create output directory
    output_dir = "public/pdfs/grade3"
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all PDF content
    pdf_content = get_pdf_content()
    
    # Create each PDF
    for pdf_info in pdf_content:
        create_pdf(pdf_info, output_dir)
    
    # Create metadata file
    metadata = create_metadata_info()
    metadata_file = os.path.join(output_dir, "metadata.json")
    
    import json
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n🎉 Successfully created {len(pdf_content)} Grade 3 Science PDFs!")
    print(f"📁 Location: {output_dir}/")
    print(f"📋 Metadata saved to: {metadata_file}")
    print("\n📚 Generated PDFs:")
    for pdf_info in pdf_content:
        print(f"   • {pdf_info['filename']}")

if __name__ == "__main__":
    main()
