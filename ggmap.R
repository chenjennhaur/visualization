require(ggmap)
require(readr)
require(dplyr)
require(maps)
require(mapdata)
iata <- read_csv("GlobalAirportDatabase.csv")
file2 <- read_csv("file.csv")
iata_min <- select(iata,IATA,Lat,Long)
orig_join <- inner_join(iata_min,file2,by=c("IATA"="Orig"))

MX <- readOGR(dsn="MEX_adm_shp",layer="MEX_adm1")
mxshp <- fortify(MX,region="HASC_1")
ggplot(mxshp,aes(x=long,y=lat,group=group)) + geom_polygon(alpha=0.5,colour="black",size=0.2,fill=NA)

# http://gis.stackexchange.com/questions/137621/join-spatial-point-data-to-polygons-in-r
