'''
Ejecutar solo en amnbiente local para agregar cupones a las categorias
'''
from promotick import PromotickSync


def main():
    s = PromotickSync()
    s.login()
    s.sync()


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(e)
