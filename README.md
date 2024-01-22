# Cash Manager

<div style="text-align: center;">
    <img src="https://cdn.discordapp.com/attachments/1173555540132118609/1196395319907319858/Screenshot_2024-01-15-11-07-00-320_com.cashmanager_app.jpg?ex=65b778f8&is=65a503f8&hm=7f74f5f1f49161cc4493f03b0af03a469fa0adad00dad0f191e98e8e3a468a36" width="150" />
    <img src="https://cdn.discordapp.com/attachments/1173555540132118609/1196405147102888078/Screenshot_2024-01-15-11-46-36-896_com.cashmanager_app.jpg?ex=65b7821f&is=65a50d1f&hm=df133d29eb2944d2b2ad7c8ab52c7e6db2f894b2e4d79f9de740625e71aa11bb" width="150" />
</div>

## Goal

You have to build a retailer-oriented distant payment system that can receive and execute
orders issued by a terminal app on your phone.

## Mobile App Structure

The mobile app is divided in 7 folders :
- [assets](mobile/src/assets) : contains all the assets (images, etc.)
- [components](mobile/src/components) : contains all the components (navigation, layout, buttons, cards, etc.)
- [services](mobile/src/services) : contains all the services related to the API calls (auth, products, bills, etc.) 
- [stores](mobile/src/stores) : contains all the stores to manage the state of the app (cart, user, etc.)
- [themes](mobile/src/themes) : contains all variables related to the theme of the app (colors, font sizes, etc.)
- [types](mobile/src/types) : contains all the types (auth, products, bills, etc.)
- [views](mobile/src/views) : contains all the views (screens)

## Setup

To launch the project, you need to have [Docker](https://www.docker.com/) installed on your computer.

Then, you can run the following command to launch the project :

```bash
docker-compose build
```

When the build is done, you can run the following command to launch the project :

```bash
docker-compose up
```

## Authors

<div style="display: flex; align-items: center; justify-content: space-around;">
    
<div>
    <img src="https://github.com/LucasCasadoPrime.png" width="100" alt="Lucas Casado">
    <p><a href="https://github.com/LucasCasadoPrime">Lucas Casado</a></p>
</div>

<div>
    <img src="https://github.com/Mehdidebordes.png" width="100" alt="Mehdi Debordes">
    <p><a href="https://github.com/Mehdidebordes">Mehdi Debordes</a></p>
</div>

<div>
    <img src="https://github.com/Shantylly.png" width="100" alt="Mickaël Grèzes">
    <p><a href="https://github.com/Shantylly">Mickaël Grèzes</a></p>
</div>

<div>
    <img src="https://github.com/raphael-lemeyeur.png" width="100" alt="Raphäel Lemeyeur">
    <p><a href="https://github.com/raphael-lemeyeur">Raphäel Lemeyeur</a></p>
</div>

<div>
    <img src="https://github.com/seb34000.png" width="100" alt="Sébastien Phélip">
    <p><a href="https://github.com/seb34000">Sébastien Phélip</a></p>
</div>

</div>
