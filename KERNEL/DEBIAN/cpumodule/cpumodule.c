#define LINUX

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>

#include <linux/module.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>

/* to get works meminfo */
#include <linux/hugetlb.h>
#include <linux/mm.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <asm/page.h>
#include <asm/pgtable.h>

#include <linux/percpu.h>
#include <linux/vmalloc.h>
#include <linux/configfs.h>

#include <linux/ktime.h>
#include <linux/time.h>

struct task_struct *task;       /*    Structure defined in sched.h for tasks/processes    */
struct task_struct *task_child; /*    Structure needed to iterate through task children    */
struct list_head *list;         /*    Structure needed to iterate through the list in each task->children struct    */
struct timespec tsa;
struct timespec tsb;
struct timespec tsc;
int cantidad;

#define PROCFS_NAME "cpumodule"


static int OS3_show(struct seq_file *m, void *v)
{
    // int eax=11,ebx=0,ecx=1,edx=0;
    // asm volatile("cpuid"
    //     : "=a" (eax),
    //       "=b" (ebx),
    //       "=c" (ecx),
    //       "=d" (edx)
    //     : "0" (eax), "2" (ecx)
    //     : );
    // getnstimeofday(&tsa);
    // getnstimeofday(&tsb);
    // //double wall_time = tsa.tv_sec - tsb.tv_sec;
    // /*double cpu_time =*/ getnstimeofday(&tsc);
    // uint64_t percentage = tsc.tv_sec /eax/ (tsa.tv_sec - tsb.tv_sec);
    // seq_printf(m,"Cpu %ld \n",percentage);
    getnstimeofday(&tsa);
    /*Count Processes*/
    printk(KERN_INFO "%s", "LOADING MODULE\n"); /*    good practice to log when loading/removing modules    */
    int cantidad;
    for_each_process(task)
    { 
        printk(KERN_INFO "%s", "process n\n");
        if (task->state != 0){
            cantidad = cantidad + 1; 
        }
    };

    //seq_printf(m,"Procesos: %d \n",cantidad);
    seq_printf(m,"%d\n",cantidad);
    getnstimeofday(&tsb);
    //seq_printf(m,"CPU: %ld \n",tsa.tv_nsec/tsb.tv_nsec);
    seq_printf(m,"%ld\n",tsa.tv_nsec/tsb.tv_nsec);
	return 0;
}

static int OS3_open(struct inode *inode, struct file *file)
{
    return single_open(file, OS3_show, NULL);
}

static const struct file_operations OS3_fops = {
    .owner = THIS_MODULE,
    .open = OS3_open,
    .read = seq_read,
    .llseek = seq_lseek,
    .release = single_release,
};

static int __init OS3_init(void)
{
    printk(KERN_INFO "Cargando modulo.\r\n");
    proc_create(PROCFS_NAME, 0, NULL, &OS3_fops);
    printk(KERN_INFO "Completado. Procceso: /proc/%s.\r\n", PROCFS_NAME);
    return 0;
}

static void __exit OS3_exit(void)
{
    remove_proc_entry(PROCFS_NAME, NULL);
    printk(KERN_INFO "Modulo deshabilitado.\r\n");
}

module_init(OS3_init);
module_exit(OS3_exit);
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("módulo que lee la lista de procesos");
MODULE_LICENSE("Grupo10");