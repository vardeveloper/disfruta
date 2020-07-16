p=~/work/disfrutaprofuturo
echo $(pwd)
mysql -uroot < $p/bin/drop_and_create_database.sql
source $p/env/bin/activate
python models.py
mysql -uroot disfruta < $p/bin/insert_experiencias_menu.sql
mysql -uroot disfruta < $p/bin/insert_test_user.sql
mysql -uroot disfruta < test_data/providers.sql
mysql -uroot disfruta < test_data/event.sql
mysql -uroot disfruta < test_data/birthday.sql
mysql -uroot disfruta < test_data/welcome.sql
mysql -uroot disfruta < $p/bin/link_event_user.sql
mysql -uroot disfruta < $p/insert_stock_procedure.sql
mysql -uroot disfruta < $p/bin/insert_stock.sql

export DATABASE_DSN=mysql://root@localhost/disfruta
export PROMOTICK_API=http://beneficios.profuturo.promotick.com/api/mobile
export PROMOTICK_API_LOGIN=$PROMOTICK_API/login
export PROMOTICK_API_COUPONS=$PROMOTICK_API/listarDescuentos
export PROMOTICK_API_CODES=$PROMOTICK_API/listarCodigos
export PROMOTICK_API_USER=45961378
export PROMOTICK_API_PASS=123456
export PROMOTICK_API_BUSINESS_ID=44

#python -c "
#from promotick import PromotickSync
#s = PromotickSync()
#s.login()
#s.sync()
#"
# mysql -uroot disfruta < test_data/add_banners.sql
# mysql -uroot disfruta < $p/bin/activate_categories.sql
