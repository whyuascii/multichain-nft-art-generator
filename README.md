# NFT multi-chain Art Generator

Generate a NFT collection on multiple blockchains

This is a simple NFT Art Generator inspired by HashLips and changed to typescript, a web app, and additional blockchains.



Todo:
- Fix `any` to be proper types
- Create Interfaces
- Reorg Files
- Make it a webapp?
- Change Config to be a better config file

Notes:

you use name#number.png where #number is the rarity
Rarity is based on the elements inside a folder not the whole project
if you have 3 elements (a,b,c)
rarity a = (#a/ #a+#b+#c) x100

Bg1 - #30
Bg2 - #30
Bg3 - #40
Total weight = 100
Rarity bg1 = ( 30/100) x100 = 30%

Imagine the total weight is 80
(30/80) x100 = 37,5
